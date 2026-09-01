import browser from "webextension-polyfill";
import {aggregateWorkflowsStatus, PullRequest, resolveWorkflowRawStatus, Run, Status} from "./model";

const getCircleCiApiToken = async (): Promise<string | null> => {
  const storageData = await browser.storage.local.get('CIRCLECI_API_TOKEN');
  const circleCiApiToken = storageData.CIRCLECI_API_TOKEN;
  if (undefined === circleCiApiToken || circleCiApiToken === '') {
    return null;
  }

  return circleCiApiToken;
};

const getPullRequestsToMonitor = async (): Promise<PullRequest[]> => {
  const records = await browser.storage.sync.get('pull_request_to_monitor');

  return records['pull_request_to_monitor'] ?? [];
};

const setPullRequestsToMonitor = async (pullRequests: PullRequest[]) => {
  await browser.storage.sync.set({'pull_request_to_monitor': pullRequests});
};

const fetchCircleCi = async (circleCiApiToken: string, url: string) => {
  const response = await fetch(url, {
    headers: {
      'Circle-Token': circleCiApiToken,
      'Content-Type': 'application/json',
    },
  });

  return response.ok ? await response.json() : null;
};

const fetchCurrentRun = async (circleCiApiToken: string, pullRequest: PullRequest): Promise<Run | null> => {
  const pipelineUrl = `https://circleci.com/api/v2/project/github/${pullRequest.organisation_name}/${pullRequest.project_name}/pipeline?branch=${pullRequest.branch_name}`;
  const pipelines = await fetchCircleCi(circleCiApiToken, pipelineUrl);
  const pipeline = pipelines?.items?.[0] ?? null;
  if (pipeline === null) {
    return null;
  }

  const workflowUrl = `https://circleci.com/api/v2/pipeline/${pipeline.id}/workflow`;
  const workflowsResponse = await fetchCircleCi(circleCiApiToken, workflowUrl);
  const items = workflowsResponse?.items ?? [];

  const workflows = await Promise.all(items.map(async (item: {id: string; name: string; status: string}) => {
    const jobsResponse = await fetchCircleCi(circleCiApiToken, `https://circleci.com/api/v2/workflow/${item.id}/job`);
    const jobs = jobsResponse?.items ?? [];

    return {
      id: item.id,
      name: item.name,
      status: aggregateWorkflowsStatus([{status: resolveWorkflowRawStatus(item.status, jobs)}]),
    };
  }));

  return {id: pipeline.number, workflows};
};

const notificationUrls = new Map<string, string>();

const notifyStatusChange = (pullRequest: PullRequest, run: Run, status: Status) => {
  const notificationId = `${pullRequest.organisation_name}-${pullRequest.project_name}-${pullRequest.branch_name}-${run.id}-${status}`;
  const url = `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${run.id}`;
  notificationUrls.set(notificationId, url);

  const workflowNames = (run.workflows ?? []).filter(workflow => workflow.status === status).map(workflow => workflow.name).join(', ');

  browser.notifications.create(notificationId, {
    type: 'basic',
    title: `${pullRequest.organisation_name}/${pullRequest.project_name} (${pullRequest.branch_name})`,
    message: (status === 'success' ? 'Success: ' : 'Failed: ') + workflowNames,
    iconUrl: 'icon-48.png',
  });
};

let refreshing = false;

const setUpBackgroundScript = () => {
  onMonitorPullRequest();
  onNotificationClicked();
  refreshOnUpdateAvailable();
  refreshOnUpdate();
  refreshRegularly(triggerRefresh);
  refreshOnDemand(triggerRefresh);

  async function triggerRefresh() {
    if (refreshing) {
      return;
    }

    try {
      refreshing = true;

      const circleCiApiToken = await getCircleCiApiToken();
      if (circleCiApiToken === null) {
        return;
      }

      const pullRequestsToMonitor = await getPullRequestsToMonitor();
      const updatedPullRequests: PullRequest[] = [];

      for (const pullRequest of pullRequestsToMonitor) {
        const currentRun = await fetchCurrentRun(circleCiApiToken, pullRequest);
        if (currentRun === null) {
          updatedPullRequests.push(pullRequest);
          continue;
        }

        const previousRun = pullRequest.runs[pullRequest.runs.length - 1];
        const previousStatus = previousRun !== undefined ? aggregateWorkflowsStatus(previousRun.workflows ?? []) : undefined;
        const currentStatus = aggregateWorkflowsStatus(currentRun.workflows);
        const hasTransitioned = previousRun !== undefined
          && (previousRun.id !== currentRun.id || previousStatus !== currentStatus);

        if (hasTransitioned && (currentStatus === 'success' || currentStatus === 'failed')) {
          notifyStatusChange(pullRequest, currentRun, currentStatus);
        }

        const runs = previousRun !== undefined && previousRun.id === currentRun.id
          ? [...pullRequest.runs.slice(0, -1), currentRun]
          : [...pullRequest.runs, currentRun];

        updatedPullRequests.push({...pullRequest, runs});
      }

      await setPullRequestsToMonitor(updatedPullRequests);
    } finally {
      refreshing = false;
    }
  }
}

function refreshOnUpdateAvailable() {
  browser.runtime.onUpdateAvailable.addListener(() => {
    console.debug("Update available");
    browser.runtime.reload();
  });
}

/**
 * Opens the options page when the extension is installed.
 */
const refreshOnUpdate = () => {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      browser.runtime.openOptionsPage();
    }
  });
}

const refreshRegularly = (triggerRefresh: () => Promise<void>) => {
  browser.alarms.create({periodInMinutes: 3});
  browser.alarms.onAlarm.addListener((alarm) => {
    console.debug("Alarm triggered", alarm);
    triggerRefresh().catch(console.error);
  });
}

const refreshOnDemand = (triggerRefresh: () => Promise<void>) => {
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "refresh") {
      triggerRefresh().catch(console.error);
      browser.notifications.create('Refresh job', {
        type: 'basic',
        message: 'Workflows have been refreshed',
        title: 'Keep track CircleCi',
        iconUrl: 'icon-48.png'
      });
    }
  });
}

function onNotificationClicked() {
  browser.notifications.onClicked.addListener((notificationId) => {
    const url = notificationUrls.get(notificationId);
    if (url === undefined) {
      return;
    }

    browser.tabs.create({url});
  });
}

function onMonitorPullRequest() {
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "monitorPullRequest") {
      const {type, ...pullRequest} = message as {type: string} & PullRequest;

      getPullRequestsToMonitor().then((pullRequestToMonitor) => {
        const alreadyMonitored = pullRequestToMonitor.some((existing) =>
          existing.organisation_name === pullRequest.organisation_name
          && existing.project_name === pullRequest.project_name
          && existing.branch_name === pullRequest.branch_name
          && (existing.source ?? 'github') === (pullRequest.source ?? 'github')
        );

        if (alreadyMonitored) {
          return;
        }

        setPullRequestsToMonitor([...pullRequestToMonitor, pullRequest]);

        browser.notifications.create('New job monitored', {
          type: 'basic',
          message: 'New job monitored',
          title: 'Keep track CircleCi',
          iconUrl: 'icon-48.png'
        });
      })
    }
  });
}

setUpBackgroundScript();

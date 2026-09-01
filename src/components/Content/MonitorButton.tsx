import React, {useState} from 'react';
import browser from 'webextension-polyfill';
import {Button} from '../Button';
import {useCircleCiApi} from '../../hooks';
import {usePullRequestToMonitor} from '../../hooks/usePullRequestToMonitor';
import {aggregateWorkflowsStatus, PullRequest, removePullRequest, resolveWorkflowRawStatus, Source} from '../../model';

type MonitorButtonProps = {
  organisationName: string;
  projectName: string;
  branchName: string;
  id: number;
  source: Source;
};

const MonitorButton = ({organisationName, projectName, branchName, id, source}: MonitorButtonProps) => {
  const [pullRequestsToMonitor, setPullRequestsToMonitor] = usePullRequestToMonitor();
  const circleCiApi = useCircleCiApi();
  const [isMonitoring, setIsMonitoring] = useState(false);

  const monitoredPullRequest = pullRequestsToMonitor.find(pullRequest =>
    pullRequest.organisation_name === organisationName
    && pullRequest.project_name === projectName
    && pullRequest.branch_name === branchName
    && (pullRequest.source ?? 'github') === source
  );

  const handleClick = async () => {
    setIsMonitoring(true);

    const pullRequest: PullRequest = {
      id,
      source,
      organisation_name: organisationName,
      project_name: projectName,
      branch_name: branchName,
      runs: [],
    };

    const pipeline = await circleCiApi.fetchLastPipeline(pullRequest);
    if (pipeline !== null) {
      const workflows = await circleCiApi.fetchPipelineWorkflow(pipeline.id);
      const resolvedWorkflows = await Promise.all(workflows.map(async (workflow: {id: string; name: string; status: string}) => {
        const jobs = await circleCiApi.fetchWorkflowJobs(workflow.id);

        return {
          id: workflow.id,
          name: workflow.name,
          status: aggregateWorkflowsStatus([{status: resolveWorkflowRawStatus(workflow.status, jobs.items ?? [])}]),
        };
      }));

      pullRequest.runs = [{id: pipeline.number, workflows: resolvedWorkflows}];
    }

    await browser.runtime.sendMessage({type: 'monitorPullRequest', ...pullRequest});
  };

  const handleUnmonitor = () => {
    setPullRequestsToMonitor(removePullRequest(pullRequestsToMonitor, monitoredPullRequest));
  };

  if (monitoredPullRequest !== undefined) {
    return <Button onClick={handleUnmonitor}>Stop monitoring</Button>;
  }

  return (
    <Button disabled={isMonitoring} onClick={handleClick}>
      Monitor this pipeline
    </Button>
  );
};

export {MonitorButton};

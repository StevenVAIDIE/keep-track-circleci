import browser from "webextension-polyfill";

const getCircleCiApiToken = async () => {
  const storageData = await browser.storage.sync.get();
  const circleCiApiToken = storageData.CIRCLECI_API_TOKEN;
  if (undefined === circleCiApiToken) {
    return null;
  }

  return circleCiApiToken;
};

let refreshing = false;

const setUpBackgroundScript = () => {
  onMonitorPullRequest();
  refreshOnUpdateAvailable();
  refreshOnUpdate(triggerRefresh);
  refreshRegularly(triggerRefresh);
  refreshOnDemand(triggerRefresh);

  async function triggerRefresh() {
    if (refreshing) {
      return;
    }

    try {
      refreshing = true;

      return {
        response: 'test'
      }
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
 * Refreshes pull requests when the extension is installed or updated.
 */
const refreshOnUpdate = (triggerRefresh: () => Promise<{response: string}>) => {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      browser.runtime.openOptionsPage();
    }
  });
}

const refreshRegularly = (triggerRefresh: () => Promise<{response: string}>) => {
  browser.alarms.create({periodInMinutes: 3});
  browser.alarms.onAlarm.addListener((alarm) => {
    console.debug("Alarm triggered", alarm);
    triggerRefresh().catch(console.error);
  });
}

const refreshOnDemand = (triggerRefresh: () => Promise<{response: string}>) => {
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "refresh") {
      triggerRefresh().catch(console.error);
      browser.notifications.create('Refresh job', {
        type: 'list',
        message: 'Workflows have been refreshed',
        title: 'Keep track CircleCi',
        iconUrl: 'icon-48.png'
      });
    }
  });
}


function onMonitorPullRequest() {
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "monitorPullRequest") {
      browser.notifications.create('New job monitored', {
        type: 'list',
        message: 'New job monitored',
        title: 'Keep track CircleCi',
        iconUrl: 'icon-48.png'
      });
    }
  });
}

setUpBackgroundScript();

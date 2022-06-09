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
const refreshOnUpdate = (triggerRefresh: () => Promise<void>) => {
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
    console.debug("Message received", message);
    if (message.kind === "refresh") {
      triggerRefresh().catch(console.error);
    }
  });
}

setUpBackgroundScript();

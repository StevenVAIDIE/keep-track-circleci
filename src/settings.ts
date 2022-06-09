import browser from "webextension-polyfill";

const getCircleCiApiToken = async () => {
  const storageData = await browser.storage.sync.get();
  const circleCiApiToken = storageData.CIRCLECI_API_TOKEN;
  if (undefined === circleCiApiToken) {
    return null;
  }

  return circleCiApiToken;
};

const CIRCLE_CI_API_TOKEN_INPUT_ID = '#circleCiApiToken';

const initialize = async () => {
  const input = document.querySelector<HTMLInputElement>(CIRCLE_CI_API_TOKEN_INPUT_ID);
  if (input !== null) {
    input.value = await getCircleCiApiToken() ?? '';
  }
};

const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault();

  await browser.storage.sync.set({
    CIRCLECI_API_TOKEN: document.querySelector<HTMLInputElement>(CIRCLE_CI_API_TOKEN_INPUT_ID)?.value ?? '',
  });
};

document.addEventListener('DOMContentLoaded', initialize);
document.querySelector('form')?.addEventListener('submit', handleSubmit);

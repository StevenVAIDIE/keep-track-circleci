import React from 'react';
import browser from "webextension-polyfill";
import {useCircleCiApi} from "../../hooks";

type GithubApproveButtonProps = {
  workflowId: string;
  workflowName: string;
  stepName: string;
  stepApprovalRequestId: string;
  onClick: () => void;
};

const GithubApproveButton = ({onClick, stepApprovalRequestId, stepName, workflowId, workflowName}: GithubApproveButtonProps) => {
  const circleCiApi = useCircleCiApi();
  const handleClick = async () => {
    await circleCiApi.approveStep(workflowId, stepApprovalRequestId);
    onClick();
    browser.runtime.sendMessage({
      type: 'monitorWorkflow',
      workflowId: workflowId,
    }).catch(() =>
      console.log('An error occurred during sending monitor workflow')
    );
  }

  return (
    <button onClick={handleClick}>
      {`${workflowName} - ${stepName}`}
    </button>
  )
}

export {GithubApproveButton};

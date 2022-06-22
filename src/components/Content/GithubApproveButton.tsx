import React from 'react';
import browser from "webextension-polyfill";
import {useCircleCiApi} from "../../hooks";
import {Button} from "../Button";
import {CircleciIcon} from "../../icons";

type GithubApproveButtonProps = {
  workflowId: string;
  stepName: string;
  stepApprovalRequestId: string;
  onClick: () => void;
};

const GithubApproveButton = ({onClick, stepApprovalRequestId, stepName, workflowId}: GithubApproveButtonProps) => {
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
    <Button onClick={handleClick}>
      <CircleciIcon /> {/** TODO: Replace by StartIcon */}
      {stepName}
    </Button>
  )
}

export {GithubApproveButton};

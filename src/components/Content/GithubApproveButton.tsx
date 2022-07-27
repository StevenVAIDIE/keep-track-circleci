import React from 'react';
import browser from "webextension-polyfill";
import {useCircleCiApi} from "../../hooks";
import {Button} from "../Button";
import {PullRequest} from "../../model";

type GithubApproveButtonProps = {
  workflowId: string;
  stepName: string;
  stepApprovalRequestId: string;
  organisationName: string;
  projectName: string;
  sourceBranchName: string;
  pullRequestId: number;
  onClick: () => void;
};

const GithubApproveButton = ({onClick, organisationName, projectName, sourceBranchName, pullRequestId, stepApprovalRequestId, stepName, workflowId}: GithubApproveButtonProps) => {
  const circleCiApi = useCircleCiApi();
  const handleClick = async () => {
    await circleCiApi.approveStep(workflowId, stepApprovalRequestId);
    const pullRequestToMonitor: PullRequest = {
      organisation_name: organisationName,
      project_name: projectName,
      branch_name: sourceBranchName,
      id: pullRequestId,
      runs: []
    };

    browser.runtime.sendMessage({
      type: 'monitorPullRequest',
      workflowId: pullRequestToMonitor,
    }).catch(() =>
      console.log('An error occurred during sending monitor workflow')
    );

    onClick();
  }

  return (
    <Button onClick={handleClick}>
      {stepName}
    </Button>
  )
}

export {GithubApproveButton};

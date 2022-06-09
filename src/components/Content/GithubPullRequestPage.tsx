import React from "react";
import {useCircleCiApprovalSteps} from "../../hooks";
import {GithubApproveButton} from "./GithubApproveButton";
import styled from "styled-components";

const Sidebar = styled.nav`
`;

type GithubPullRequestPageProps = {
  organisationName: string;
  projectName: string;
  sourceBranchName: string;
  pullRequestId: number;
}

const GithubPullRequestPage = ({organisationName, projectName, pullRequestId, sourceBranchName}: GithubPullRequestPageProps) => {
  const [approvalSteps, refresh] = useCircleCiApprovalSteps(organisationName, projectName, sourceBranchName);
console.log(approvalSteps)
  return (
    <Sidebar>
      {approvalSteps.map((approvalStep) => (
        <GithubApproveButton
          key={approvalStep.approval_request_id}
          workflowId={approvalStep.workflowId}
          workflowName={approvalStep.workflowName}
          stepName={approvalStep.name}
          stepApprovalRequestId={approvalStep.approval_request_id}
          onClick={refresh}
        />
      ))}
    </Sidebar>
  )
}

export {GithubPullRequestPage};

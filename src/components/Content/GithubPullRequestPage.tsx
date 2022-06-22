import React, {useState} from "react";
import {useCircleCiApprovalSteps} from "../../hooks";
import {GithubApproveButton} from "./GithubApproveButton";
import styled from "styled-components";
import {useBranchWorkflow} from "../../hooks/useBranchWorkflows";
import {TabBar} from "../TabBar";
import {act} from "react-dom/test-utils";

const Sidebar = styled.nav<{isOpen: boolean}>`
  position: fixed;
  width: 100%;
  height: ${({isOpen}) => isOpen ? '200px' : '0px'};
  bottom: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid black;
  padding-left: 5px;
  padding-right: 5px;
`;

type GithubPullRequestPageProps = {
  organisationName: string;
  projectName: string;
  sourceBranchName: string;
  pullRequestId: number;
}

const GithubPullRequestPage = ({organisationName, projectName, pullRequestId, sourceBranchName}: GithubPullRequestPageProps) => {
  const [isOpen, setOpen] = useState(true);
  const [workflows, refresh] = useBranchWorkflow(organisationName, projectName, sourceBranchName);
  const [activeWorkflowId, setActiveWorkflowId] = useState<null | string>(null);

  const activeWorkflow = workflows.find((workflow, index) => (activeWorkflowId === null && index === 0) || workflow.id === activeWorkflowId);

  return (
    <Sidebar isOpen={isOpen} /*onClose={setOpen(false)}*/>
      {workflows.length !== 0 ? (
        <>
          <TabBar>
            {workflows.map((workflow) => (
              <TabBar.Tab
                isActive={activeWorkflow === workflow}
                onClick={() => setActiveWorkflowId(workflow.id)}
              >
                {workflow.name}
              </TabBar.Tab>
            ))}
          </TabBar>
          <div>
            {activeWorkflow.steps.map(step => (
              <GithubApproveButton
                key={step.approval_request_id}
                workflowId={activeWorkflow.id}
                stepName={step.name}
                stepApprovalRequestId={step.approval_request_id}
                onClick={refresh}
              />
            ))}
          </div>
        </>
      ): (
        <>No workflows have been found</>
      )}
    </Sidebar>
  )
}

export {GithubPullRequestPage};

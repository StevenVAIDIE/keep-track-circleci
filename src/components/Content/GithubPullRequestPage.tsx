import React, {useState} from "react";
import styled from "styled-components";
import browser from "webextension-polyfill";
import {useBranchWorkflow} from "../../hooks/useBranchWorkflows";
import {useCircleCiApi} from "../../hooks";
import {TabBar} from "../TabBar";
import {IconButton} from "../IconButton";
import {getColorForStatus, StatusDot, worstStatus} from "../StatusPill";
import {MonitorButton} from "./MonitorButton";
import {ChevronIcon, CircleciIcon} from "../../icons";
import {PullRequest, Status} from "../../model";

const Sidebar = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  max-height: 320px;
  bottom: 16px;
  right: 16px;
  z-index: 100;
  background-color: white;
  border: 1px solid #C7CBD4;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(27, 31, 36, 0.12);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
`;

const CollapseButton = styled(IconButton)`
  svg {
    transition: transform 0.15s ease;
  }
`;

const toRingColor = (status: Status) => getColorForStatus(status).replace('rgb(', 'rgba(').replace(')', ', 0.16)');

const Fab = styled.button<{$status: Status}>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 16px;
  right: 16px;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${({$status}) => getColorForStatus($status)};
  background-color: white;
  box-shadow: 0 4px 16px rgba(27, 31, 36, 0.12), 0 0 0 3px ${({$status}) => toRingColor($status)};
  cursor: pointer;
  padding: 0;

  img { display: block; width: 20px; height: 20px; }
`;

const FabBadge = styled.span<{$status: Status}>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: ${({$status}) => getColorForStatus($status)};
  ${({$status}) => $status === 'running' && 'animation: keep-track-circleci-fab-pulse 1.2s ease-in-out infinite;'}

  @keyframes keep-track-circleci-fab-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

const TabBarRow = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 12px 0 16px;
  gap: 8px;
  border-bottom: 1px solid #C7CBD4;

  > div {
    flex: 1 1 auto;
    min-width: 0;
    border-bottom: none;
  }

  > button {
    background-color: transparent;
  }
`;

const EmptyStateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px;
  color: #57606a;
  font-size: 13px;
`;

const JobsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-content: flex-start;
  max-height: 72px;
  overflow-y: auto;
  gap: 6px;
  padding: 10px 16px;
`;

const JobChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px 2px 6px;
  border: none;
  border-radius: 10px;
  background-color: #F6F8FA;
  color: #57606a;
  font-size: 11px;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #eaecef;
  }
`;

type GithubPullRequestPageProps = {
  pullRequest: PullRequest;
}

const GithubPullRequestPage = ({pullRequest}: GithubPullRequestPageProps) => {
  const [isOpen, setOpen] = useState(true);
  const [workflows, refresh, pipelineNumber, hasLoaded] = useBranchWorkflow(pullRequest);
  const [activeWorkflowId, setActiveWorkflowId] = useState<null | string>(null);
  const circleCiApi = useCircleCiApi();

  const activeWorkflow = workflows.find((workflow, index) => (activeWorkflowId === null && index === 0) || workflow.id === activeWorkflowId);

  const handleJobClick = async (job: {name: string; status: Status}) => {
    if (job.status === 'on_hold') {
      const step = activeWorkflow?.steps.find(step => step.name === job.name);
      if (step === undefined) {
        return;
      }

      await circleCiApi.approveStep(activeWorkflow.id, step.approval_request_id);
      refresh();
      return;
    }

    window.open(
      `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${pipelineNumber}/workflows/${activeWorkflow?.id}`,
      '_blank'
    );
  };

  const monitorButton = (
    <MonitorButton
      organisationName={pullRequest.organisation_name}
      projectName={pullRequest.project_name}
      branchName={pullRequest.branch_name}
      id={pullRequest.id}
      source="github"
    />
  );

  const circleciLink = pipelineNumber !== null && (
    <IconButton
      icon={<CircleciIcon />}
      title="Open on CircleCI"
      href={
        activeWorkflow !== undefined
          ? `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${pipelineNumber}/workflows/${activeWorkflow.id}`
          : `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${pipelineNumber}`
      }
      target="_blank"
    />
  );

  const collapseButton = (
    <CollapseButton
      icon={<ChevronIcon />}
      title="Collapse"
      onClick={() => setOpen(false)}
    />
  );

  if (!hasLoaded) {
    return null;
  }

  if (!isOpen) {
    const overallStatus = worstStatus(workflows.flatMap(workflow => workflow.jobs.map(job => job.status)));

    return (
      <Fab $status={overallStatus} onClick={() => setOpen(true)} title="Expand">
        <img src={browser.runtime.getURL('icon-48.png')} alt="" />
        <FabBadge $status={overallStatus} />
      </Fab>
    );
  }

  return (
    <Sidebar>
      {workflows.length !== 0 ? (
        <>
          <TabBarRow>
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
            {circleciLink}
            {monitorButton}
            {collapseButton}
          </TabBarRow>
          {activeWorkflow.jobs.length !== 0 && (
            <JobsRow>
              {activeWorkflow.jobs.map(job => (
                <JobChip key={job.name} onClick={() => handleJobClick(job)}>
                  <StatusDot status={job.status} />
                  {job.name}
                </JobChip>
              ))}
            </JobsRow>
          )}
        </>
      ): (
        <EmptyStateRow>
          No workflows have been found
          {circleciLink}
          {monitorButton}
          {collapseButton}
        </EmptyStateRow>
      )}
    </Sidebar>
  )
}

export {GithubPullRequestPage};

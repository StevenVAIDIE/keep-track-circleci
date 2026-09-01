import React, {useState} from "react";
import styled from "styled-components";
import browser from "webextension-polyfill";
import {IconButton, StatusDot, StatusPill, worstStatus} from "../../components";
import {CircleciIcon, DeleteIcon, GithubIcon, MuteIcon, RefreshIcon} from "../../icons";
import {aggregateWorkflowsStatus, groupPullRequestByBranch, PullRequest, removePullRequest, removePullRequestsByBranch} from "../../model";
import {BranchList} from "./BranchList";
import {PullRequestList} from "./PullRequestList";

const MonitoredPullRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MonitoredPullRequestHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #E4E7ED;
  font-size: 14px;
  font-weight: 600;
  color: #2B2E34;
`;

const MonitoredPullRequestBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 280px;
`;

const PullRequestRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const PullRequestSummary = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const WorkflowRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 2px;
`;

const WorkflowChip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px 2px 6px;
  border-radius: 10px;
  background-color: #EFF1F4;
  color: #5C6474;
  font-size: 11px;
  text-decoration: none;
  white-space: nowrap;

  :hover {
    background-color: #E4E7ED;
    color: #2B2E34;
  }
`;

type MonitoredPullRequestProps = {
  pullRequests: PullRequest[];
  onPullRequestsChange: (pullRequests: PullRequest[]) => void;
};

const MonitoredPullRequest = ({pullRequests, onPullRequestsChange}: MonitoredPullRequestProps) => {
  const groupedPullRequestByBranch = groupPullRequestByBranch(pullRequests);
  const [selectedBranchName, setSelectedBranchName] = useState<null | string>(Object.keys(groupedPullRequestByBranch)[0] ?? null);
  const selectedPullRequests = groupedPullRequestByBranch[selectedBranchName] ?? null;

  const handleRefreshWorkflow = () => {
    browser.runtime.sendMessage({
      type: 'refresh',
      a_message: 'test',
    })
  }

  const handleRemovePullRequestByBranch = (branchName: string) => {
    const newPullRequests = removePullRequestsByBranch(pullRequests, branchName);

    if (selectedBranchName === branchName) {
      setSelectedBranchName(Object.keys(groupPullRequestByBranch(newPullRequests))[0] ?? null)
    }

    onPullRequestsChange(newPullRequests);
  }

  const handleRemovePullRequest = (pullRequest: PullRequest) => {
    const newPullRequests = removePullRequest(pullRequests, pullRequest);

    if (selectedBranchName === pullRequest.branch_name && !newPullRequests.some((pullRequest) => pullRequest.branch_name === selectedBranchName)) {
      setSelectedBranchName(newPullRequests[0]?.branch_name ?? null)
    }

    onPullRequestsChange(newPullRequests);
  }

  return (
    <MonitoredPullRequestContainer>
      <MonitoredPullRequestHeader>
        Keep track CircleCI
        <IconButton icon={<RefreshIcon />} title="Refresh" onClick={handleRefreshWorkflow}/>
      </MonitoredPullRequestHeader>
      <MonitoredPullRequestBody>
        <BranchList>
          {Object.keys(groupedPullRequestByBranch).map((branchName) => {
            const branchStatus = worstStatus(
              groupedPullRequestByBranch[branchName].map(pullRequest => {
                const lastRun = pullRequest.runs[pullRequest.runs.length - 1];
                return lastRun !== undefined ? aggregateWorkflowsStatus(lastRun.workflows ?? []) : 'stopped';
              })
            );

            return (
              <BranchList.Item
                key={branchName}
                isSelected={branchName === selectedBranchName}
                onClick={() => setSelectedBranchName(branchName)}
              >
                <StatusDot status={branchStatus} />
                {branchName}
                <BranchList.Spacer />
                <IconButton icon={<MuteIcon/>} onClick={() => handleRemovePullRequestByBranch(branchName)}/>
              </BranchList.Item>
            );
          })}
        </BranchList>
        {selectedPullRequests !== null && (
          <PullRequestList>
            {selectedPullRequests.map((pullRequest) => {
              const lastRun = pullRequest.runs[pullRequest.runs.length - 1];
              const overallStatus = lastRun !== undefined ? aggregateWorkflowsStatus(lastRun.workflows ?? []) : 'stopped';
              const pipelineUrl = lastRun !== undefined
                ? `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${lastRun.id}`
                : `https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}`;

              return (
                <PullRequestList.Item key={pullRequest.organisation_name + '-' + pullRequest.project_name + '-' + pullRequest.branch_name + '-' + pullRequest.id}>
                  <PullRequestRow>
                    <PullRequestSummary>
                      <StatusPill status={overallStatus} />
                      {pullRequest.organisation_name}/{pullRequest.project_name}
                      <PullRequestList.Spacer />
                      <IconButton icon={<MuteIcon/>} onClick={() => handleRemovePullRequest(pullRequest)}/>
                      {(pullRequest.source ?? 'github') === 'github' && (
                        <IconButton
                          icon={<GithubIcon/>}
                          href={`https://github.com/${pullRequest.organisation_name}/${pullRequest.project_name}/pull/${pullRequest.id}`}
                          target="_blank"
                        />
                      )}
                      <IconButton
                        icon={<CircleciIcon />}
                        href={pipelineUrl}
                        target="_blank"
                      />
                    </PullRequestSummary>
                    {lastRun !== undefined && (lastRun.workflows ?? []).length > 0 && (
                      <WorkflowRow>
                        {(lastRun.workflows ?? []).map(workflow => (
                          <WorkflowChip
                            key={workflow.id}
                            href={`https://app.circleci.com/pipelines/gh/${pullRequest.organisation_name}/${pullRequest.project_name}/${lastRun.id}/workflows/${workflow.id}`}
                            target="_blank"
                          >
                            <StatusDot status={workflow.status} />
                            {workflow.name}
                          </WorkflowChip>
                        ))}
                      </WorkflowRow>
                    )}
                  </PullRequestRow>
                </PullRequestList.Item>
              )
            })}
          </PullRequestList>
        )}
      </MonitoredPullRequestBody>
    </MonitoredPullRequestContainer>
  )
}

export {MonitoredPullRequest}

import React, {useState} from "react";
import styled from "styled-components";
import browser from "webextension-polyfill";
import {IconButton, StatusPill} from "../../components";
import {CircleciIcon, DeleteIcon, GithubIcon, MuteIcon, RefreshIcon} from "../../icons";
import {groupPullRequestByBranch, PullRequest, removePullRequest, removePullRequestsByBranch} from "../../model";
import {BranchList} from "./BranchList";
import {PullRequestList} from "./PullRequestList";

const MonitoredPullRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

const MonitoredPullRequestHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MonitoredPullRequestBody = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
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
        Keep track circleci workflow
        <IconButton icon={<RefreshIcon />} title="Refresh" onClick={handleRefreshWorkflow}/>
      </MonitoredPullRequestHeader>
      <MonitoredPullRequestBody>
        <BranchList>
          {Object.keys(groupedPullRequestByBranch).map((branchName) => (
            <BranchList.Item
              key={branchName}
              isSelected={branchName === selectedBranchName}
              onClick={() => setSelectedBranchName(branchName)}
            >
              {branchName}
              <BranchList.Spacer />
              <IconButton icon={<MuteIcon/>} onClick={() => handleRemovePullRequestByBranch(branchName)}/>
            </BranchList.Item>
          ))}
        </BranchList>
        {selectedPullRequests !== null && (
          <PullRequestList>
            {selectedPullRequests.map((pullRequest) => {
              const lastRun = pullRequest.runs[pullRequest.runs.length - 1];

              return (
                <PullRequestList.Item key={pullRequest.organisation_name + '-' + pullRequest.project_name + '-' + pullRequest.branch_name + '-' + pullRequest.id}>
                  <StatusPill status={lastRun.status} />
                  {pullRequest.organisation_name}/{pullRequest.project_name}
                  <PullRequestList.Spacer />
                  <IconButton icon={<MuteIcon/>} onClick={() => handleRemovePullRequest(pullRequest)}/>
                  <IconButton
                    icon={<GithubIcon/>}
                    href={`https://github.com/${pullRequest.organisation_name}/${pullRequest.project_name}/pull/${pullRequest.id}`}
                    target="_blank"
                  />
                  <IconButton
                    icon={<CircleciIcon />}
                    href={`https://app.circleci.com/pipelines/github/${pullRequest.organisation_name}/${pullRequest.project_name}/${lastRun.id}/workflows/${lastRun.workflow_id}`}
                    target="_blank"
                  />
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

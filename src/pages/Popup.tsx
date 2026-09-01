import React from 'react';
import styled from 'styled-components';
import {usePullRequestToMonitor} from "../hooks/usePullRequestToMonitor";
import {MonitoredPullRequest} from "../components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 640px;
  min-height: 320px;
  background-color: #FBFBFC;
  color: #2B2E34;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-grow: 1;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyStateTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2B2E34;
`;

const EmptyStateSubtitle = styled.div`
  font-size: 13px;
  color: #8998AC;
  max-width: 320px;
`;

const Popup = () => {
  const [pullRequestsToMonitor, setPullRequestsToMonitor] = usePullRequestToMonitor();

  return (
    <Container>
      {pullRequestsToMonitor.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No monitoring in progress</EmptyStateTitle>
          <EmptyStateSubtitle>
            Open a GitHub PR or a CircleCI pipeline page to start monitoring a build.
          </EmptyStateSubtitle>
        </EmptyState>
      ): (
        <MonitoredPullRequest pullRequests={pullRequestsToMonitor} onPullRequestsChange={setPullRequestsToMonitor}/>
      )}
    </Container>
  );
}

export {Popup};

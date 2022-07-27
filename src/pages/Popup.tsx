import React from 'react';
import styled from 'styled-components';
import {usePullRequestToMonitor} from "../hooks/usePullRequestToMonitor";
import {MonitoredPullRequest} from "../components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 600px;
  padding: 10px;
`;

const Popup = () => {
  const [pullRequestsToMonitor, setPullRequestsToMonitor] = usePullRequestToMonitor();

  return (
    <Container>
      {pullRequestsToMonitor.length === 0 ? (
        <>You monitor no pull request</>
      ): (
        <MonitoredPullRequest pullRequests={pullRequestsToMonitor} onPullRequestsChange={setPullRequestsToMonitor}/>
      )}
    </Container>
  );
}

export {Popup};

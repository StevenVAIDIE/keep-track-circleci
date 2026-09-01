import React, {ReactNode} from "react";
import styled from "styled-components";

const WorkflowListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 4px 8px;
  overflow-y: auto;
`;

const WorkflowItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 8px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #2B2E34;
  border-bottom: 1px solid #EFF1F4;

  :last-child {
    border-bottom: none;
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

type WorkflowListProps = {
  children: ReactNode;
}

const PullRequestList = ({children}: WorkflowListProps) => {
  return (
    <WorkflowListContainer>{children}</WorkflowListContainer>
  )
};

PullRequestList.Spacer = Spacer;
PullRequestList.Item = WorkflowItem;

export {PullRequestList};

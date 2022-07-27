import React, {ReactNode} from "react";
import styled from "styled-components";

const WorkflowListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-left: 1px solid #C7CBD4;
`;

const WorkflowItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  align-items: center;
  gap: 5px;
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

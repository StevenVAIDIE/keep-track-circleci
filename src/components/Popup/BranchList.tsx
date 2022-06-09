import React, {ReactNode} from "react";
import styled from "styled-components";

const BranchListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const BranchItem = styled.div<{isSelected: boolean}>`
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 10px;
  color: ${({isSelected}) => isSelected ? '#9452BA': '#A1A9B7'};
  border-left: 4px solid ${({isSelected}) => isSelected ? '#9452BA': 'transparent'};
  align-items: center;
  gap: 5px;

  :hover {
    border-left-color: #9452BA;
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

type BranchListProps = {
  children: ReactNode;
}

const BranchList = ({children}: BranchListProps) => {
  return (
    <BranchListContainer>{children}</BranchListContainer>
  )
};

BranchList.Item = BranchItem;
BranchList.Spacer = Spacer;

export {BranchList}

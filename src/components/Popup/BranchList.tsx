import React, {ReactNode} from "react";
import styled from "styled-components";

const BranchListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 180px;
  padding: 8px;
  gap: 2px;
  border-right: 1px solid #E4E7ED;
  overflow-y: auto;
`;

const BranchItem = styled.div<{isSelected: boolean}>`
  display: flex;
  flex-direction: row;
  padding: 8px 10px;
  border-radius: 6px;
  color: ${({isSelected}) => isSelected ? '#6F2DA8': '#5C6474'};
  background-color: ${({isSelected}) => isSelected ? '#F1E6FA': 'transparent'};
  font-weight: ${({isSelected}) => isSelected ? '600' : '400'};
  align-items: center;
  gap: 5px;
  font-size: 13px;

  :hover {
    cursor: pointer;
    background-color: ${({isSelected}) => isSelected ? '#F1E6FA': '#EFF1F4'};
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

import React, {HTMLAttributes, ReactNode, useRef, KeyboardEvent} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #C7CBD4;
  background: white;
`;

const TabBarContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 1;
  height: 44px;
  flex-wrap: wrap;
  overflow: hidden;
  margin-bottom: -1px;
`;

const TabContainer = styled.div<TabProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 40px;
  color: ${({isActive}) => (isActive ? '#9452BA' : '#A1A9B7')};
  border-bottom: 3px solid ${({isActive}) => (isActive ? '#9452BA' : 'transparent')};
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    color: #9452BA;
    border-bottom: 3px solid #9452BA;
  }
`;

type TabProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Define if the tab is active.
   */
  isActive: boolean;

  /**
   * Function called when the user click on tab.
   */
  onClick?: () => void;

  /**
   * Content of the Tab.
   */
  children: ReactNode;
};

const Tab = ({children, onClick, isActive, ...rest}: TabProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      onClick?.();
    }
  };

  return (
    <TabContainer
      onKeyDown={handleKeyDown}
      onClick={onClick}
      ref={ref}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      isActive={isActive}
      {...rest}
    >
      {children}
    </TabContainer>
  );
};

type TabBarProps = {
  /**
   * When set, defines the sticky top position of the Tab bar.
   */
  sticky?: number;

  /**
   * Tabs of the Tab bar.
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * TabBar is used to move from one content to another within the same context.
 */
const TabBar = ({children, ...rest}: TabBarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Container {...rest}>
      <TabBarContainer ref={ref} role="tablist">
        {children}
      </TabBarContainer>
    </Container>
  );
};

TabBar.Tab = Tab;

export {TabBar};

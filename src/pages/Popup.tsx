import React from 'react';
import styled from 'styled-components';
import {MonitoredWorkflow} from "../components";
import {useWorkflowsToMonitor} from "../hooks";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 600px;
  padding: 10px;
`;

const Popup = () => {
  const [workflowsToMonitor, setWorkflowToMonitor] = useWorkflowsToMonitor();

  return (
    <Container>
      {workflowsToMonitor.length === 0 ? (
        <>No workflow to monitor</>
      ): (
        <MonitoredWorkflow workflows={workflowsToMonitor} onWorkflowsChange={setWorkflowToMonitor}/>
      )}
    </Container>
  );
}

export {Popup};

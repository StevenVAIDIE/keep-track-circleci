import {useStorageState} from "./useStorageState";
import {useCallback} from "react";
type WorkflowJobItem = {
  type: string,
  status: string,
  approval_request_id: string,
  name: string,
};

type WorkflowJob = {
  items: WorkflowJobItem[]
}

type Workflow = {
  id: string;
  name: string;
}

const useCircleCiApi = () => {
  const [circleciApiToken] = useStorageState<string>('', 'CIRCLECI_API_TOKEN');

  const approveStep = useCallback(async (workflowId: string, stepApprovalRequestId: string) => {
    const url = `https://circleci.com/api/v2/workflow/${workflowId}/approve/${stepApprovalRequestId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    return response.ok ? await response.json() : null;
  }, [circleciApiToken]);

  const fetchWorkflowJobs = useCallback(async (workflowId: string): Promise<WorkflowJob> => {
    const url = `https://circleci.com/api/v2/workflow/${workflowId}/job`;
    const response = await fetch(url, {
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    return response.ok ? await response.json() : null;
  }, [circleciApiToken]);

  const fetchWorkflow = useCallback(async (workflowId: string): Promise<Workflow> => {
    const url = `https://circleci.com/api/v2/workflow/${workflowId}`;
    const response = await fetch(url, {
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    return response.ok ? await response.json() : null;
  }, [circleciApiToken]);

  return {approveStep, fetchWorkflow, fetchWorkflowJobs} as const;
}

export {useCircleCiApi};
export type {Workflow, WorkflowJob, WorkflowJobItem};

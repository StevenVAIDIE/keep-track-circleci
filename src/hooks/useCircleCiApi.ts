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
  const fetchLastPipeline = async(organisationName: string, projectName: string, branchName: string) => {
    const url = `https://circleci.com/api/v2/project/gh/${organisationName}/${projectName}/pipeline?branch=${branchName}`;
    const response = await fetch(url, {
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const content = await response.json();

    return content.items?.[0] ?? null;
  }

  const fetchPipelineWorkflow = async(pipelineId: string) => {
    const url = `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow`;
    const response = await fetch(url, {
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const content = await response.json();

    return content.items ?? [];
  }

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

  return {approveStep, fetchWorkflow, fetchWorkflowJobs, fetchLastPipeline, fetchPipelineWorkflow} as const;
}

export {useCircleCiApi};
export type {Workflow, WorkflowJob, WorkflowJobItem};

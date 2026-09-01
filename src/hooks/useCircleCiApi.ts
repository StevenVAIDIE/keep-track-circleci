import {useStorageState} from "./useStorageState";
import {useCallback, useMemo} from "react";
import {PullRequest} from '../model'

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

  const fetchLastPipeline = useCallback(async(pullRequest: PullRequest) => {
    if (circleciApiToken === '') {
      return null;
    }

    const url = `https://circleci.com/api/v2/project/github/${pullRequest.organisation_name}/${pullRequest.project_name}/pipeline?branch=${pullRequest.branch_name}`;
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
  }, [circleciApiToken]);

  const fetchPipelineByNumber = useCallback(async(organisationName: string, projectName: string, pipelineNumber: string) => {
    if (circleciApiToken === '') {
      return null;
    }

    const url = `https://circleci.com/api/v2/project/github/${organisationName}/${projectName}/pipeline/${pipelineNumber}`;
    const response = await fetch(url, {
      headers: {
        'Circle-Token': circleciApiToken,
        'Content-Type': 'application/json',
      },
    });

    return response.ok ? await response.json() : null;
  }, [circleciApiToken]);

  const fetchPipelineWorkflow = useCallback(async(pipelineId: string) => {
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
  }, [circleciApiToken]);

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

  return useMemo(
    () => ({approveStep, fetchWorkflow, fetchWorkflowJobs, fetchLastPipeline, fetchPipelineByNumber, fetchPipelineWorkflow} as const),
    [approveStep, fetchWorkflow, fetchWorkflowJobs, fetchLastPipeline, fetchPipelineByNumber, fetchPipelineWorkflow]
  );
}

export {useCircleCiApi};
export type {Workflow, WorkflowJob, WorkflowJobItem};

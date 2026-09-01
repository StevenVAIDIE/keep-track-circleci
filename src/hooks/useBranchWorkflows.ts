import {useCallback, useEffect, useState} from "react";
import {useCircleCiApi} from "./useCircleCiApi";
import {aggregateWorkflowsStatus, PullRequest, Status} from "../model";

type Step = {
  name: string;
  approval_request_id: string;
};

type Job = {
  name: string;
  type: string;
  status: Status;
};

type Response = {
  id: string;
  name: string;
  steps: Step[];
  jobs: Job[];
};

const useBranchWorkflow = (pullRequest: PullRequest) => {
  const [workflows, setWorkflows] = useState<Response[]>([]);
  const [pipelineNumber, setPipelineNumber] = useState<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const circleCiApi = useCircleCiApi();

  const fetchData = useCallback(async() => {
      const currentWorkflows: Response[] = [];
      const pipeline = await circleCiApi.fetchLastPipeline(pullRequest);
      if (pipeline === null) {
        setWorkflows(currentWorkflows);
        setPipelineNumber(null);
        setHasLoaded(true);
        return;
      }

      setPipelineNumber(pipeline.number);

      const workflows = await circleCiApi.fetchPipelineWorkflow(pipeline.id);
      for (const workflow of workflows) {
        const jobs = await circleCiApi.fetchWorkflowJobs(workflow.id);
        const isPendingApproval = (item: {type: string; status: string}) =>
          item.type === 'approval' && !['success', 'failed', 'canceled', 'not_run'].includes(item.status);
        const approvalJobs = jobs.items.filter(isPendingApproval);

        currentWorkflows.push(
          {
            id: workflow.id,
            name: workflow.name,
            steps: approvalJobs.map(approvalJob => ({approval_request_id : approvalJob.approval_request_id, name: approvalJob.name})),
            jobs: jobs.items.map(item => ({
              name: item.name,
              type: item.type,
              status: isPendingApproval(item) ? 'on_hold' : aggregateWorkflowsStatus([item]),
            })),
          }
        )
      }

      setWorkflows(currentWorkflows);
      setHasLoaded(true);
    }, [circleCiApi]
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return [workflows, fetchData, pipelineNumber, hasLoaded] as const;
};

export { useBranchWorkflow };

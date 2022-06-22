import {useCallback, useEffect, useState} from "react";
import {useCircleCiApi} from "./useCircleCiApi";

type Step = {
  name: string;
  approval_request_id: string;
};

type Response = {
  id: string;
  name: string;
  steps: Step[]
};

const useBranchWorkflow = (organisationName: string, projectName: string, branchName: string) => {
  const [workflows, setWorkflows] = useState<Response[]>([]);
  const circleCiApi = useCircleCiApi();

  const fetchData = useCallback(async() => {
      const currentWorkflows: Response[] = [];
      const pipeline = await circleCiApi.fetchLastPipeline(organisationName, projectName, branchName);
      if (pipeline === null) {
        setWorkflows(currentWorkflows);
        return;
      }

      const workflows = await circleCiApi.fetchPipelineWorkflow(pipeline.id);
      for (const workflow of workflows) {
        const jobs = await circleCiApi.fetchWorkflowJobs(workflow.id);
        const approvalJobs = jobs.items.filter(item => item.type === 'approval');

        currentWorkflows.push(
          {
            id: workflow.id,
            name: workflow.name,
            steps: approvalJobs.map(approvalJob => ({approval_request_id : approvalJob.approval_request_id, name: approvalJob.name}))
          }
        )
      }

      setWorkflows(currentWorkflows);
    }, [circleCiApi]
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return [workflows, fetchData] as const;
};

export { useBranchWorkflow };

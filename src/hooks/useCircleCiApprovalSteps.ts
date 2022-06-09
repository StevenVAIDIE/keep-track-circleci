import {useCallback, useEffect, useState} from "react";
import {useCircleCiApi} from "./useCircleCiApi";

type Response = {
  workflowId: string;
  workflowName: string;
  name: string;
  approval_request_id: string;
};

const useCircleCiApprovalSteps = (organisationName: string, projectName: string, branchName: string) => {
  const [approvalSteps, setApprovalSteps] = useState<Response[]>([]);
  const circleCiApi = useCircleCiApi();

  const fetchData = useCallback(async() => {
      const currentApprovalSteps: Response[] = [];
      const pipeline = await circleCiApi.fetchLastPipeline(organisationName, projectName, branchName);
      const workflows = await circleCiApi.fetchPipelineWorkflow(pipeline.id);
      for (const workflow of workflows) {
        const jobs = await circleCiApi.fetchWorkflowJobs(workflow.id);
        const approvalJobs = jobs.items.filter(item => item.type === 'approval' && item.status === 'on_hold');
        for (const approvalJob of approvalJobs) {
          currentApprovalSteps.push({workflowId: workflow.id, workflowName: workflow.name, name: approvalJob.name, approval_request_id: approvalJob.approval_request_id});
        }
      }

      setApprovalSteps(currentApprovalSteps);
    }, [circleCiApi]
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return [approvalSteps, fetchData] as const;
};

export { useCircleCiApprovalSteps };

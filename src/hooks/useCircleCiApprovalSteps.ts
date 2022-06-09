import {useCallback, useEffect, useState} from "react";
import {useCircleCiApi} from "./useCircleCiApi";

type Response = {
  workflowId: string;
  workflowName: string;
  name: string;
  approval_request_id: string;
};

const useCircleCiApprovalSteps = (workflowIds: string[]) => {
  const [approvalSteps, setApprovalSteps] = useState<Response[]>([]);
  const circleCiApi = useCircleCiApi();

  const fetchData = useCallback(async() => {
      const currentApprovalSteps: Response[] = [];
      for (const workflowId of workflowIds) {
        const workflow = await circleCiApi.fetchWorkflow(workflowId)
        const jobs = await circleCiApi.fetchWorkflowJobs(workflowId);
        const approvalJobs = jobs.items.filter(item => item.type === 'approval' && item.status === 'on_hold');
        for (const approvalJob of approvalJobs) {
          currentApprovalSteps.push({workflowId: workflow.id, workflowName: workflow.name, name: approvalJob.name, approval_request_id: approvalJob.approval_request_id});
        }
      }

      setApprovalSteps(currentApprovalSteps);
    }, [circleCiApi, workflowIds]
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return [approvalSteps, fetchData] as const;
};

export { useCircleCiApprovalSteps };

import React, {useMemo} from 'react';
import {useCircleCiApprovalSteps} from "../hooks";
import {GithubApproveButton} from "../components";

const Content = () => {
  const actions = document.getElementsByClassName('status-actions');
  const workflowIds = useMemo(() => {
    const hrefs = Array.from(actions).map(action => action.getAttribute('href'));
    const workflowIds = hrefs.map(href => new RegExp("https://circleci\.com/workflow-run/([^\?]+)", 'gm').exec(href ?? '')?.[1] ?? null);
    const circleCiHrefs = workflowIds.filter((href): href is string => href !== null);

    return Array.from(new Set(circleCiHrefs));
  }, [actions]);

  const [approvalSteps, refresh] = useCircleCiApprovalSteps(workflowIds);

  return (
    <>
      <button onClick={refresh}>
        Refresh
      </button>
      {approvalSteps.map((approvalStep) => (
        <GithubApproveButton
          key={approvalStep.approval_request_id}
          workflowId={approvalStep.workflowId}
          workflowName={approvalStep.workflowName}
          stepName={approvalStep.name}
          stepApprovalRequestId={approvalStep.approval_request_id}
          onClick={refresh}
        />
      ))}
    </>
  )
}

export {Content}

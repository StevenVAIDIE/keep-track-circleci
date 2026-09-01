import {Status} from "./workflow";

function resolveWorkflowRawStatus(workflowStatus: string, jobs: {type: string; status: string}[]): string {
  if (workflowStatus === 'running' && jobs.some(job => job.type === 'approval' && job.status === 'on_hold')) {
    return 'on_hold';
  }

  return workflowStatus;
}

function aggregateWorkflowsStatus(workflows: {status: string}[]): Status {
  if (workflows.length === 0) {
    return 'stopped';
  }

  if (workflows.some(workflow => ['failed', 'failing', 'error'].includes(workflow.status))) {
    return 'failed';
  }

  if (workflows.some(workflow => workflow.status === 'on_hold')) {
    return 'on_hold';
  }

  if (workflows.some(workflow => workflow.status === 'running')) {
    return 'running';
  }

  if (workflows.every(workflow => ['canceled', 'not_run'].includes(workflow.status))) {
    return 'stopped';
  }

  return workflows.every(workflow => workflow.status === 'success') ? 'success' : 'retried';
}

export {aggregateWorkflowsStatus, resolveWorkflowRawStatus};

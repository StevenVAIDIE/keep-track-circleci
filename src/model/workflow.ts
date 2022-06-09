type Status = 'success' | 'running' | 'stopped' | 'failed' | 'retried';

type Project = {
  id: string;
  organisation_name: string;
  name: string;
  run_id: number;
  pr_id: number;
  status: Status;
  workflow_id: string;
  jobs: Job[]
};

type Job = {
  id: number,
  name: string,
  notify_on_finish: boolean;
}

type Workflow = {
  id: string;
  branch_name: string;
  projects: Project[];
}

const removeWorkflowProject = (workflows: Workflow[], workflowId: string, projectId: string): Workflow[] => {
  const filteredWorkflows = workflows.map(workflow =>
    workflow.id === workflowId
    ? {...workflow, projects: workflow.projects.filter(project => project.id !== projectId)}
    : workflow
  );

  return filteredWorkflows.filter(workflow => workflow.projects.length > 0);
}

const workflowExist = (workflows: Workflow[], workflowId: string) => {
  return workflows.some(workflow => workflow.id === workflowId);
}

const removeBranch = (workflows: Workflow[], workflowId: string) => {
  return workflows.filter(workflow => workflow.id !== workflowId);
}

export {workflowExist, removeBranch, removeWorkflowProject};
export type {Status, Workflow}

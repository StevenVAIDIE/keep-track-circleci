import React, {useState} from "react";
import {IconButton, StatusPill} from "../../components";
import {CircleciIcon, GithubIcon, MuteIcon} from "../../icons";
import {removeBranch, removeWorkflowProject, Workflow, workflowExist} from "../../model";
import {BranchList} from "./BranchList";
import {WorkflowList} from "./WorkflowList";

type MonitoredWorkflowProps = {
  workflows: Workflow[];
  onWorkflowsChange: (workflows: Workflow[]) => void;
};

const MonitoredWorkflow = ({workflows, onWorkflowsChange}: MonitoredWorkflowProps) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<null | string>(workflows[0]?.id ?? null);
  const selectedWorkflow = workflows.find(monitoredWorkflow => monitoredWorkflow.id === selectedWorkflowId) ?? null;

  const handleRemoveBranch = (workflowId: string) => {
    const newWorkflows = removeBranch(workflows, workflowId);
    if (selectedWorkflowId === workflowId) {
      setSelectedWorkflowId(newWorkflows[0]?.id ?? null)
    }

    onWorkflowsChange(newWorkflows);
  }

  const handleRemoveWorkflowProject = (workflowId: string, projectId: string) => {
    const newWorkflows = removeWorkflowProject(workflows, workflowId, projectId);
    if (selectedWorkflowId === workflowId && workflowExist(newWorkflows, workflowId)) {
      setSelectedWorkflowId(newWorkflows[0]?.id ?? null)
    }

    onWorkflowsChange(newWorkflows);
  }

  return (
    <>
      <BranchList>
        {workflows.map((monitoredWorkflow) => (
          <BranchList.Item
            key={monitoredWorkflow.id}
            isSelected={selectedWorkflowId === monitoredWorkflow.id}
            onClick={() => setSelectedWorkflowId(monitoredWorkflow.id)}
          >
            {monitoredWorkflow.branch_name}
            <BranchList.Spacer />
            <IconButton icon={<MuteIcon/>} onClick={() => handleRemoveBranch(monitoredWorkflow.id)}/>
          </BranchList.Item>
        ))}
      </BranchList>
      {selectedWorkflow !== null && (
        <WorkflowList>
          {selectedWorkflow.projects.map((project) => (
            <WorkflowList.Item key={project.id}>
              <StatusPill status={project.status} />
              {project.name} ({project.run_id})
              <WorkflowList.Spacer />
              <IconButton icon={<MuteIcon/>} onClick={() => handleRemoveWorkflowProject(selectedWorkflow.id, project.id)}/>
              <IconButton
                icon={<GithubIcon/>}
                href={`https://github.com/${project.organisation_name}/${project.name}/pull/${project.pr_id}`}
                target="_blank"
              />
              <IconButton
                icon={<CircleciIcon />}
                href={`https://app.circleci.com/pipelines/github/${project.organisation_name}/${project.name}/${project.run_id}/workflows/${project.workflow_id}`}
                target="_blank"
              />
            </WorkflowList.Item>
          ))}
        </WorkflowList>
      )}
    </>
  )
}

export {MonitoredWorkflow}

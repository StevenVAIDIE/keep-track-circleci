import {Workflow} from "../model/workflow";
import {useStorageState} from "./useStorageState";
import {useState} from "react";

const useWorkflowsToMonitor = () => {
  return useState<Workflow[]>([
    {
      id: '10',
      branch_name: 'RAB-10',
      projects: [
        {
          id: '19283',
          group_name: 'akeneo',
          name: 'pim-enterprise-dev',
          run_id: 12,
          pr_id: 1234,
          status: "running",
          workflow_id: '77766-76637-77363-35524',
          jobs: [
            {
              id: 23,
              name: 'ready to start?',
              notify_on_finish: true,
            },
          ]
        }
      ]
    },
    {
      id: '123',
      branch_name: 'RAB-101',
      projects: [
        {
          id: '92383',
          group_name: 'akeneo',
          name: 'pim-enterprise-dev',
          run_id: 123,
          pr_id: 12342,
          status: "success",
          workflow_id: '77766-76637-77363-35524',
          jobs: [
            {
              id: 23,
              name: 'ready to start?',
              notify_on_finish: true,
            },
          ]
        },
        {
          id: '19282',
          group_name: 'akeneo',
          name: 'pim-community-dev',
          run_id: 1232,
          pr_id: 12342,
          status: "failed",
          workflow_id: '77766-76637-77363-35524',
          jobs: [
            {
              id: 23,
              name: 'ready to start?',
              notify_on_finish: true,
            },
          ]
        }
      ]
    }
]);
  //return useStorageState<Workflow[]>([], 'workflows');
};

export { useWorkflowsToMonitor };

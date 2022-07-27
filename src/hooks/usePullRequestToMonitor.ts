import {PullRequest} from "../model";
import {useState} from "react";

const usePullRequestToMonitor = () => {
  return useState<PullRequest[]>([
    {
      id: 10,
      branch_name: 'RAB-10',
      organisation_name: 'akeneo',
      project_name: 'pim-enterprise-dev',
      runs: [
        {
          id: 19283,
          workflow_id: '77766-76637-77363-35524',
          status: 'running',
          steps: [],
        }
      ]
    },
    {
      id: 12342,
      organisation_name: 'akeneo',
      project_name: 'pim-enterprise-dev',
      branch_name: 'RAB-101',
      runs: [
        {
          id: 123,
          workflow_id:  '77766-76637-77363-35524',
          status: "success",
          steps: [],
        }
      ],
    },
    {
      id: 12342,
      organisation_name: 'akeneo',
      project_name: 'pim-community-dev',
      branch_name: 'RAB-101',
      runs: [
        {
          id: 1232,
          workflow_id: '77766-76637-77363-35524',
          status: "failed",
          steps: [],
        }
      ],
    }
  ]);
  //return useStorageState<Workflow[]>([], 'workflows');
};

export { usePullRequestToMonitor };

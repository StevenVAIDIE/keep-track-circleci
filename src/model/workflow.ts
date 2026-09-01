type Status = 'success' | 'running' | 'on_hold' | 'stopped' | 'failed' | 'retried';

type Source = 'github' | 'circleci';

type PullRequest = {
  id: number;
  organisation_name: string;
  project_name: string;
  branch_name: string;
  source?: Source;
  runs: Run[]
};

type Run = {
  id: number;
  workflows: WorkflowStatus[];
};

type WorkflowStatus = {
  id: string;
  name: string;
  status: Status;
};

function groupPullRequestByBranch(pullRequests: PullRequest[]): {[branchName: string]: PullRequest[]} {
  return pullRequests.reduce(function(accumulator, pullRequest) {
    (accumulator[pullRequest.branch_name] = accumulator[pullRequest.branch_name] || []).push(pullRequest);

    return accumulator;
  }, {});
}

function removePullRequestsByBranch(pullRequests: PullRequest[], branchName: string) {
  return pullRequests.filter(pullRequest => pullRequest.branch_name !== branchName);
}

function removePullRequest(pullRequests: PullRequest[], pullRequestToRemove: PullRequest) {
  return pullRequests.filter(pullRequest =>
    pullRequest.id !== pullRequestToRemove.id
    || pullRequest.branch_name !== pullRequestToRemove.branch_name
    || pullRequest.organisation_name !== pullRequestToRemove.organisation_name
    || pullRequest.project_name !== pullRequestToRemove.project_name
    || (pullRequest.source ?? 'github') !== (pullRequestToRemove.source ?? 'github')
  );
}
export {groupPullRequestByBranch, removePullRequestsByBranch, removePullRequest};
export type {PullRequest, Run, WorkflowStatus, Status, Source}

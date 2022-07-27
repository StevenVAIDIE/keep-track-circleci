type Status = 'success' | 'running' | 'stopped' | 'failed' | 'retried';

type PullRequest = {
  id: number;
  organisation_name: string;
  project_name: string;
  branch_name: string;
  runs: Run[]
};

type Run = {
  id: number;
  workflow_id: string;
  status: Status;
  steps: Steps[];
};

type Steps = {
  id: number;
  name: string;
  approval_request_id: string;
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
  );
}
export {groupPullRequestByBranch, removePullRequestsByBranch, removePullRequest};
export type {PullRequest, Status}

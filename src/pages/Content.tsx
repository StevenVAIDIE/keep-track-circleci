import React from 'react';
import {CircleciPipelinePage, GithubPullRequestPage} from "../components";
import {PullRequest} from "../model";

function isStringNumber(x: any): x is string {
  return /^-?\d+$/.test(x);
}

function isString(x: any): x is string {
  return typeof x === "string";
}

const Content = () => {
  if (location.hostname === 'app.circleci.com') {
    return <CircleciPipelineContent />;
  }

  return <GithubPullRequestContent />;
}

const CircleciPipelineContent = () => {
  const currentUrl = location.href.toString();
  const match = currentUrl.match(/https:\/\/app\.circleci\.com\/pipelines\/gh\/(?<organisationName>[a-zA-Z0-9\-_.]+)\/(?<projectName>[a-zA-Z0-9\-_.]+)\/(?<pipelineNumber>[0-9]+)/);
  if (null === match) {
    return null;
  }

  const organisationName = match.groups?.organisationName;
  const projectName = match.groups?.projectName;
  const pipelineNumber = match.groups?.pipelineNumber;

  if (!isString(organisationName) || !isString(projectName) || !isStringNumber(pipelineNumber)) {
    return null;
  }

  return (
    <CircleciPipelinePage organisationName={organisationName} projectName={projectName} pipelineNumber={pipelineNumber} />
  );
}

const GithubPullRequestContent = () => {
  const currentUrl = location.href.toString();
  const match = currentUrl.match(/https:\/\/github.com\/(?<organisationName>[a-zA-Z\-_]+)\/(?<projectName>[a-zA-Z\-_]+)\/pull\/(?<pullRequestId>[0-9]+)/);
  if (null === match) {
    return null;
  }

  const organisationName = match.groups?.organisationName;
  const projectName = match.groups?.projectName;
  const pullRequestId = match.groups?.pullRequestId;
  const headBranchLink = document.querySelectorAll('a[data-component="BranchName"]')[1];
  const headBranchHref = headBranchLink instanceof HTMLAnchorElement ? headBranchLink.getAttribute('href') : null;
  const sourceBranchName = headBranchHref?.match(/\/tree\/(?<branchName>.+)$/)?.groups?.branchName ?? null;

  if (
    !isString(organisationName)
    || !isString(projectName)
    || !isStringNumber(pullRequestId)
    || !isString(sourceBranchName)
  ) {
    throw Error('Cannot retrieve information for this page');
  }

  const pullRequest: PullRequest = {
    organisation_name: organisationName,
    project_name: projectName,
    branch_name: sourceBranchName,
    id: parseInt(pullRequestId),
    runs: [],
  }

  return (
    <GithubPullRequestPage pullRequest={pullRequest} />
  );
}

export {Content}

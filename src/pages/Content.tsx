import React from 'react';
import {GithubPullRequestPage} from "../components";

function isStringNumber(x: any): x is string {
  return /^-?\d+$/.test(x);
}

function isString(x: any): x is string {
  return typeof x === "string";
}

const Content = () => {
  const currentUrl = location.href.toString();
  const match = currentUrl.match(/https:\/\/github.com\/(?<organisationName>[a-zA-Z\-_]+)\/(?<projectName>[a-zA-Z\-_]+)\/pull\/(?<pullRequestId>[0-9]+)/);
  if (null === match) {
    return null;
  }

  const organisationName = match.groups?.organisationName;
  const projectName = match.groups?.projectName;
  const pullRequestId = match.groups?.pullRequestId;
  const sourceBranchName = document.querySelector('.head-ref a.no-underline span.css-truncate-target')?.innerHTML ?? null;

  if (
    !isString(organisationName)
    || !isString(projectName)
    || !isStringNumber(pullRequestId)
    || !isString(sourceBranchName)
  ) {
    throw Error('Cannot retrieve information for this page');
  }

  return (
    <GithubPullRequestPage
      organisationName={organisationName}
      projectName={projectName}
      pullRequestId={parseInt(pullRequestId)}
      sourceBranchName={sourceBranchName}
    />
  );
}

export {Content}

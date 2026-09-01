import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useCircleCiApi} from '../../hooks';
import {MonitorButton} from './MonitorButton';

const Banner = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: white;
  border: 1px solid #C7CBD4;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
`;

type CircleciPipelinePageProps = {
  organisationName: string;
  projectName: string;
  pipelineNumber: string;
};

const CircleciPipelinePage = ({organisationName, projectName, pipelineNumber}: CircleciPipelinePageProps) => {
  const circleCiApi = useCircleCiApi();
  const [branchName, setBranchName] = useState<null | string>(null);

  useEffect(() => {
    let cancelled = false;

    circleCiApi.fetchPipelineByNumber(organisationName, projectName, pipelineNumber).then((pipeline) => {
      if (!cancelled) {
        setBranchName(pipeline?.vcs?.branch ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [organisationName, projectName, pipelineNumber, circleCiApi]);

  if (branchName === null) {
    return null;
  }

  return (
    <Banner>
      Suivre ce pipeline CircleCI
      <MonitorButton
        organisationName={organisationName}
        projectName={projectName}
        branchName={branchName}
        id={parseInt(pipelineNumber)}
        source="circleci"
      />
    </Banner>
  );
};

export {CircleciPipelinePage};

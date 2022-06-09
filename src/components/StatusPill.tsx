import React, {Ref} from 'react';
import styled from 'styled-components';
import {Status} from "../model";

const getColorForStatus = (status: Status) => {
  const statusColor = {
    success: 'rgb(0, 137, 51)',
    running: 'rgb(0, 120, 202)',
    stopped: 'rgb(85, 85, 85)',
    failed: 'rgb(150, 0, 8)',
    retried: 'rgb(137, 137, 137)',
  };

  return statusColor[status] ?? 'rgb(161, 169, 183)';
}
const StatusPillContainer = styled.div<{status: Status}>`
  width: 12px;
  height: 12px;
  background-color: ${({status}) => getColorForStatus(status)};
  border-radius: 50%;
  background-clip: content-box;
  padding: 2px;
  border: 1px solid ${({status}) => getColorForStatus(status)};
`;

type StatusPillProps = {
  status: Status;
};

const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({status, ...rest}: StatusPillProps, forwardedRef: Ref<HTMLDivElement>) => {
    return <StatusPillContainer title={status} status={status} ref={forwardedRef} {...rest} />;
  }
);

export {StatusPill};

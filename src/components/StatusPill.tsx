import React, {Ref} from 'react';
import styled from 'styled-components';
import {Status} from "../model";
import {PauseIcon} from "../icons";

const STATUS_COLOR: {[key in Status]: string} = {
  success: 'rgb(0, 137, 51)',
  running: 'rgb(0, 120, 202)',
  on_hold: 'rgb(178, 118, 0)',
  stopped: 'rgb(85, 85, 85)',
  failed: 'rgb(197, 16, 30)',
  retried: 'rgb(137, 137, 137)',
};

const STATUS_BACKGROUND: {[key in Status]: string} = {
  success: 'rgb(224, 244, 231)',
  running: 'rgb(222, 238, 250)',
  on_hold: 'rgb(252, 238, 210)',
  stopped: 'rgb(233, 234, 237)',
  failed: 'rgb(252, 226, 228)',
  retried: 'rgb(236, 236, 236)',
};

const STATUS_LABEL: {[key in Status]: string} = {
  success: 'Success',
  running: 'Running',
  on_hold: 'On hold',
  stopped: 'Stopped',
  failed: 'Failed',
  retried: 'Retried',
};

const getColorForStatus = (status: Status) => STATUS_COLOR[status] ?? 'rgb(161, 169, 183)';
const getBackgroundForStatus = (status: Status) => STATUS_BACKGROUND[status] ?? 'rgb(238, 239, 242)';
const getLabelForStatus = (status: Status) => STATUS_LABEL[status] ?? status;

const StatusPillContainer = styled.div<{status: Status}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 3px 8px 3px 6px;
  border-radius: 10px;
  background-color: ${({status}) => getBackgroundForStatus(status)};
  color: ${({status}) => getColorForStatus(status)};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

const Dot = styled.span<{status: Status}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  ${({status}) => status === 'running' && 'animation: keep-track-circleci-pulse 1.2s ease-in-out infinite;'}

  @keyframes keep-track-circleci-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

const DotCircle = styled.span<{status: Status}>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({status}) => getColorForStatus(status)};
`;

type StatusPillProps = {
  status: Status;
};

const StatusIndicator = ({status}: {status: Status}) => (
  <Dot status={status}>
    {status === 'on_hold' ? <PauseIcon size={9} color={getColorForStatus(status)} /> : <DotCircle status={status} />}
  </Dot>
);

const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({status, ...rest}: StatusPillProps, forwardedRef: Ref<HTMLDivElement>) => {
    return (
      <StatusPillContainer title={getLabelForStatus(status)} status={status} ref={forwardedRef} {...rest}>
        <StatusIndicator status={status} />
        {getLabelForStatus(status)}
      </StatusPillContainer>
    );
  }
);

const StatusDot = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({status, ...rest}: StatusPillProps, forwardedRef: Ref<HTMLSpanElement>) => {
    return (
      <Dot title={getLabelForStatus(status)} status={status} ref={forwardedRef} {...rest}>
        {status === 'on_hold' ? <PauseIcon size={9} color={getColorForStatus(status)} /> : <DotCircle status={status} />}
      </Dot>
    );
  }
);

const STATUS_PRIORITY: Status[] = ['failed', 'on_hold', 'running', 'retried', 'stopped', 'success'];

function worstStatus(statuses: Status[]): Status {
  return STATUS_PRIORITY.find(status => statuses.includes(status)) ?? 'stopped';
}

export {StatusPill, StatusDot, worstStatus, getColorForStatus};

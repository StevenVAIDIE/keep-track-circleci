import * as React from "react"
import {IconProps} from "./IconProps";

const MuteIcon = ({title, size = 24, color = 'currentColor', ...props}: IconProps) => (
  <svg viewBox="0 0 1024 896" width={size} height={size} {...props}>
    {title && <title>{title}</title>}
    <path d="M128 384H0v256h128l256 192h64V192h-64L128 384zM864 416l-64-64-96 96-96-96-63 63.5 95 96.5-96 96 64 64 96-96 96 96 64-64-96-96L864 416z" />
  </svg>
)

export {MuteIcon};

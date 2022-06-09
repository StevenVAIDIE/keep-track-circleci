import {SVGProps} from "react";

type IconProps = SVGProps<SVGSVGElement> &
  {
    title?: string;
    size?: number;
    color?: string;
  };

export type {IconProps};

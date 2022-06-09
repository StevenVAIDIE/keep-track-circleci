import React, {ReactElement, Ref} from "react";
import styled from 'styled-components';
import {IconProps} from "../icons/IconProps";

const IconButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;  
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  width: 24px;
  border-style: none;
  background: transparent;
  font-size: 13px;
  font-weight: 400;
  height: 24px;
  cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
  font-family: inherit;
  transition: background-color 0.1s ease;
  outline-style: none;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 50%;

  &:focus {
    box-shadow: 0 0 0 2px #BDD3E9;
  }
`;

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon: ReactElement<IconProps>;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({icon, href, ...rest}: IconButtonProps, forwardedRef: Ref<HTMLButtonElement>) => {
    return (
      <IconButtonContainer as={undefined !== href ? 'a' : 'button'} ref={forwardedRef} href={href} {...rest}>
        {React.cloneElement(icon, {size: 16})}
      </IconButtonContainer>
    );
  }
);

export {IconButton}

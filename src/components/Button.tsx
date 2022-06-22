import React, {cloneElement, isValidElement, ReactElement, ReactNode, Ref} from "react";
import styled from 'styled-components';
import {IconProps} from "../icons";
import {IconButton} from "./IconButton";

const ButtonContainer = styled.button`
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

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, href, ...rest}: ButtonProps, forwardedRef: Ref<HTMLButtonElement>) => {
    const decoratedChildren = React.Children.map(children, (child) => {
      if (isValidElement(child) && child.type === IconButton) {
        return cloneElement(child, {size: 16})
      }

      return child;
    });

    return (
      <ButtonContainer as={undefined !== href ? 'a' : 'button'} ref={forwardedRef} href={href} {...rest}>
        {decoratedChildren}
      </ButtonContainer>
    );
  }
);

export {Button}

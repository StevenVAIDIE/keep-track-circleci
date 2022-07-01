import React, {isValidElement, ReactNode, Ref, SyntheticEvent} from 'react';
import styled, {css} from 'styled-components';
import {IconProps} from "../icons";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>
  & React.AnchorHTMLAttributes<HTMLAnchorElement>
  & {
    /**
     * Use when the user cannot proceed or until an input is collected.
     */
    disabled?: boolean;

    /**
     * Function called when the user clicks on the button or hit enter when focused.
     */
    onClick?: (event: SyntheticEvent) => void;

    /**
     * Url to go to if the button is clicked. This allow your button to open in a new tab in case of cmd/ctrl + click
     */
    href?: string;

    /**
     * Accessibility label to describe shortly the button.
     */
    ariaLabel?: string;

    /**
     * Define which element is the label of this button for accessibility purposes. Expect a DOM node id.
     */
    ariaLabelledBy?: string;

    /**
     * Define what element is describing this button for accessibility purposes. Expect a DOM node id.
     */
    ariaDescribedBy?: string;

    /**
     * Children of the button.
     */
    children?: ReactNode;
  };

const Container = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-width: 1px;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  border-radius: 16px;
  border-style: solid;
  padding: 0 15px;
  height: 32px;
  font-family: inherit;
  transition: background-color 0.1s ease;
  outline-style: none;
  text-decoration: none;
  white-space: nowrap;
  color: #47749f;
  background-color: white;
  border-color: #5992c7;

  &:focus {
    box-shadow: 0 0 0 2px #bdd3e9;
  }

  &:hover:not([disabled]) {
    color: #355777;
    background-color: #dee9f4;
    border-color: #47749f;
  }

  &:active:not([disabled]) {
    color: #355777;
    border-color: #355777;
  }
`;

/**
 * Buttons express what action will occur when the users clicks.
 * Buttons are used to initialize an action, either in the background or foreground of an experience.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      disabled = false,
      href,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      children,
      onClick,
      type = 'button',
      ...rest
    }: ButtonProps,
    forwardedRef: Ref<HTMLButtonElement>
  ) => {
    const handleAction = (event: SyntheticEvent) => {
      if (disabled || undefined === onClick) return;

      onClick(event);
    };

    return (
      <Container
        as={undefined !== href ? 'a' : 'button'}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={forwardedRef}
        role="button"
        type={type}
        onClick={handleAction}
        href={disabled ? undefined : href}
        {...rest}
      >
        {React.Children.map(children, child => {
          if (isValidElement<IconProps>(child)) {
            return React.cloneElement(child, {size: child.props.size ?? 18});
          }

          return child;
        })}
      </Container>
    );
  }
);

export {Button};

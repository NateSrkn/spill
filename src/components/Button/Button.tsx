import classNames from "classnames";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { IconBaseProps } from "react-icons";
import styles from "./Button.module.scss";
export enum ButtonColorVariants {
  NEUTRAL = "neutral",
  PRIMARY = "primary",
  TONAL = "tonal",
  DELETE = "delete",
  DARK = "dark",
}
export enum ButtonTypeVariant {
  DEFAULT = "button",
  TEXT = "text",
  ICON = "icon",
  ICON_BUTTON_WITH_TEXT = "button__withTextUnderIcon",
}

export type ButtonProps = {
  buttonVariant?: ButtonTypeVariant;
  colorVariant?: ButtonColorVariants;
  icon?: React.FunctionComponent<IconBaseProps>;
  children?: React.ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      buttonVariant = ButtonTypeVariant.DEFAULT,
      colorVariant = ButtonColorVariants.NEUTRAL,
      icon: Icon,
      children,
      ...rest
    }: ButtonProps,
    ref
  ) {
    const utilityName = `${buttonVariant}__${colorVariant}`;
    const className =
      buttonVariant === ButtonTypeVariant.TEXT
        ? classNames(styles[utilityName])
        : classNames(styles[buttonVariant], styles[colorVariant]);
    switch (buttonVariant) {
      case ButtonTypeVariant.ICON_BUTTON_WITH_TEXT: {
        return (
          <button {...rest} className={styles[buttonVariant]} ref={ref}>
            <div className={classNames(styles.icon, styles[colorVariant])}>
              {Icon ? <Icon /> : null}
            </div>
            <div className={styles[colorVariant]}>{children}</div>
          </button>
        );
      }
      case ButtonTypeVariant.TEXT: {
        <button {...rest} className={className} ref={ref}>
          <span className="bg-transparent">{children}</span>
        </button>;
      }
      default: {
        return (
          <button {...rest} className={className} ref={ref}>
            {children}
          </button>
        );
      }
    }
  }
);

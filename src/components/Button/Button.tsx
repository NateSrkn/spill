import { cva, type VariantProps } from "class-variance-authority";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps
  extends VariantProps<typeof btn>,
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  children?: React.ReactNode;
}

export const btn = cva(styles.btn, {
  variants: {
    intent: {
      icon: styles["btn-icon"],
      default: styles["btn-default"],
      none: "font-normal flex-col",
    },
    size: {
      none: [],
      sm: styles["btn-sm"],
      lg: styles["btn-lg"],
    },
    colors: {
      destructive: styles.destructive,
      tertiary: styles.tertiary,
      neutral: styles.neutral,
      primary: styles.primary,
      none: [],
    },
  },
  defaultVariants: {
    colors: "neutral",
    size: "lg",
    intent: "default",
  },
});

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, intent, size, colors, ...rest }: ButtonProps,
    ref
  ) {
    const className = btn({ intent, size, colors });
    return (
      <button {...rest} className={`${className} group`} ref={ref}>
        {children}
      </button>
    );
  }
);

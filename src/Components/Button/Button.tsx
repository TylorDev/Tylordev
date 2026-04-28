import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

type Variant = "primary" | "ghost" | "default" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export default function Button({
  variant = "default",
  icon,
  iconRight,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

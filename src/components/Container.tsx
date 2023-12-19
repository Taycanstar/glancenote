import clsx from "clsx";
import { HTMLAttributes, FC } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Container: FC<ContainerProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx("mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
};

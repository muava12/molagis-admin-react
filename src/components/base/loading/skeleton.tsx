import { cx } from "@/utils/cx";

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Animation variant */
  variant?: "pulse" | "wave";
}

export const Skeleton = ({
  width,
  height,
  className,
  rounded = "md",
  variant = "pulse",
}: SkeletonProps) => {
  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded];

  const baseClasses = "bg-secondary animate-pulse";
  
  const style = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cx(
        baseClasses,
        roundedClass,
        variant === "wave" && "animate-pulse bg-gradient-to-r from-secondary via-primary_hover to-secondary bg-[length:200%_100%]",
        className
      )}
      style={style}
    />
  );
};

export default Skeleton;
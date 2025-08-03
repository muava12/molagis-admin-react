interface SlimHeaderProps {
  /** Additional content to display */
  children?: React.ReactNode;
}

export const SlimHeader = ({
  children,
}: SlimHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-center border-b border-secondary bg-primary px-4 lg:px-6">
      {/* Center section - only content */}
      <div className="flex-1 flex justify-center">
        {children}
      </div>
    </header>
  );
};
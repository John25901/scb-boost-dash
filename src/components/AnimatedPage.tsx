import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

const AnimatedPage = ({ children, className = "" }: AnimatedPageProps) => (
  <div className={`animate-fade-in ${className}`}>
    {children}
  </div>
);

export const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedPageProps & { delay?: number }) => (
  <div
    className={`animate-scale-in ${className}`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
  >
    {children}
  </div>
);

export default AnimatedPage;

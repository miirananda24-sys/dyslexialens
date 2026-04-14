import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <div className="animate-page-in">
      {children}
    </div>
  );
};

export default PageTransition;

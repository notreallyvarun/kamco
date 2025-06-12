import React from "react";
import LoginForm from "./LoginForm";
import QuickActions from "./QuickActions";
import LanguageToggle from "./language-toggle";
const RightPanel = () => {
  return (
    <div className="relative w-full md:w-1/2 bg-white flex flex-col items-center justify-center">
      <div className="absolute top-8 right-5">
        <LanguageToggle />
      </div>
      <div className="relative ">
        <img src="/login-logo.svg" alt="Company Logo" className="mt-5 w-[164px] h-[54px] h-auto mb-15" />
      </div>
     
      <LoginForm />
      <QuickActions />
    </div>
  );
};

export default RightPanel;

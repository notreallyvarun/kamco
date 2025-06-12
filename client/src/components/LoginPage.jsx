import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import SecurityTipsSheet from "./SecurityTips";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <RightPanel />      
      <SecurityTipsSheet/>
    </div>
  );
};

export default LoginPage;

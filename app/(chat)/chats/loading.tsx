import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin" />
    </div>
  );
};

export default loading;

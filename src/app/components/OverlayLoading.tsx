import React from "react";

function LoadingOverlay({ isLoading }: any) {
  return (
    isLoading && (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-200"></div>
      </div>
    )
  );
}

export default LoadingOverlay;

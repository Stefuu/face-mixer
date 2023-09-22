import React from "react";

function PersonDescription({ description }) {
  return (
    <div className="w-full p-5 mx-auto">
      <label
        htmlFor="person-description"
        className="block text-gray-700 text-sm font-semibold mb-2"
      >
        Person Description
      </label>
      <div className="relative rounded-md shadow-sm">
        <div
          id="person-description"
          className="bg-white border border-gray-300 rounded-md p-4 text-gray-700 text-lg font-medium leading-relaxed"
        >
          {description}
        </div>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG icon */}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default PersonDescription;

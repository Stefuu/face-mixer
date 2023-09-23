import { useState, useEffect } from "react";

interface RandomStringProps {
  strings: string[];
}

const LoadingText: React.FC<RandomStringProps> = ({ strings }) => {
  const [randomString, setRandomString] = useState<string>(
    strings[Math.floor(Math.random() * strings.length)]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * strings.length);
      setRandomString(strings[randomIndex]);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [strings]);

  return (
    <div className="wrapper border-y py-2">
      <div className="loading-text ">
        <h1 className="text-center text-xl mb-2">Loading description...</h1>
        <h1 className="text-center text-3xl">
          {randomString}
          <span className="dot-one"> .</span>
          <span className="dot-two"> .</span>
          <span className="dot-three"> .</span>
        </h1>
      </div>
    </div>
  );
};

export default LoadingText;

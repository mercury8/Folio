// App.jsx
import React, { useState } from "react";
import Preloader from "./Preloader";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : (
        <div className="bg-black ">
          <h1 className="text-red-800">Welcome to the Website</h1>
          <p>The content has loaded!!</p>
        </div>
      )}
    </div>
  );
};

export default App;

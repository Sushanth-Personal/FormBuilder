import { useState, useEffect } from "react";

const useScreenSize = (size) => {
  const [isBelowSize, setIsBelowSize] = useState(window.innerWidth < size);

  useEffect(() => {
    const handleResize = () => {
      setIsBelowSize(window.innerWidth < size);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [size]); // Only depend on `size`

  return isBelowSize; // Return true or false
};

export default useScreenSize;

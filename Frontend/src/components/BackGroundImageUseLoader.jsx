import React, { useEffect, useState } from "react";
import  "../Theme.css";

function useLoadingData() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return isLoading;
}

function BlackBackGround() {
  const isLoading = useLoadingData();
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("Theme")) || [
      { color: "black", backGroundColor: "white" },
    ]
  );

  const [invertColor, setInvertColor] = useState({
    color: theme[0].color === "black" ? "white" : "black",
    backGroundColor:
      theme[0].backGroundColor === "#000033" ? "white" : "#000033",
  });

  useEffect(() => {
    localStorage.setItem("Theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    document.body.style.color = theme[0].color;
    document.body.style.backgroundColor = theme[0].backGroundColor;
  }, [theme]);

  function changeMode() {
    setInvertColor({
      color: invertColor.color === "white" ? "black" : "white",
      backGroundColor:
        invertColor.backGroundColor === "#000033" ? "white" : "#000033",
    });

    setTheme([
      {
        color: invertColor.color,
        backGroundColor: invertColor.backGroundColor,
      },
    ]);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (

        <>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <span  onClick={changeMode}>
          <input type="checkbox" />
        </span>
      </>
  );
}

export default BlackBackGround;

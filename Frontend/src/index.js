import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import reportWebVitals from "./reportWebVitals";

const HousingApp = React.lazy(() => import("./HousingApp"));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
     <Suspense fallback={<center style={{marginTop:"10%"}} ><h1>Loading...</h1></center>}>
      <HousingApp/>
    </Suspense>
  </>
);

reportWebVitals();

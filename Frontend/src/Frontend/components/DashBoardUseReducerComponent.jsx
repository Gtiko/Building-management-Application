import axios from "axios";
import { useEffect, useReducer, useState } from "react";

const initialState = {
  isAdmin: true,
  isLoggedIn: false,
  isAddUserHidden: true,
  appImages: [],
  emailRequested: "",
  submittedSMS: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_ADMIN":
      return { ...state, isAdmin: action.payload };
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload };
    case "SET_IS_ADD_USER_HIDDEN":
      return { ...state, isAddUserHidden: action.payload };
    case "SET_APP_IMAGES":
      return { ...state, appImages: action.payload };
    case "SET_SUBMITTED_SMS":
      return { ...state, submittedSMS: action.payload };
    default:
      return state;
  }
}

export function HousingDashBoardComponent() {
  const [{ appImages, submittedSMS }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [emailRequested, setEmailRequested] = useState("");

  useEffect(() => {
    dispatch({ type: "SET_IS_LOGGED_IN", payload: false });
    dispatch({ type: "SET_IS_ADMIN", payload: true });
    dispatch({ type: "SET_IS_ADD_USER_HIDDEN", payload: true });

    axios.get("http://localhost:8080/housing").then((res) => {
      dispatch({ type: "SET_APP_IMAGES", payload: res.data });
    });
  }, []);

  async function sendVisitRequest(e, buildingName) {
    e.preventDefault();
    console.log(buildingName);
    if (emailRequested !== "") {
      const reqInfo = { email: emailRequested, buildingName: buildingName };
      axios.post("http://localhost:8080/housing/emails", reqInfo);
      dispatch({ type: "SET_SUBMITTED_SMS", payload: false });
      dispatch({ type: "SET_EMAIL_REQUESTED", payload: "gjf" });
      setTimeout(() => {
        dispatch({ type: "SET_SUBMITTED_SMS", payload: true });
      }, 2000);
    } else {
      console.log("error...");
    }
    clearForm();
  }
  function clearForm(){
    setEmailRequested("");
  }

  return (
    <center>
      {appImages.map((each, index) => (
        <div key={index} id="dashBoard">
          <h3>Sample Property for {each.name}</h3> <br />
          <div>
            <img src={each.img1} alt="loading..." width={200} height={200} />{" "}
            &nbsp;&nbsp;
            <img
              src={each.img2}
              alt="loading..."
              width={200}
              height={200}
            />{" "}
            &nbsp;&nbsp;
            <img
              src={each.img3}
              alt="loading..."
              width={200}
              height={200}
            />{" "}
            &nbsp;&nbsp;
          </div>
          <h6 hidden={submittedSMS} style={{ color: "green" , position:"fixed" }}>
            Request submitted
          </h6>
          <div style={{ textAlign: "right", margin: "50px" }}>
            <form onSubmit={(e) => sendVisitRequest(e, each.name)}>
              <input
                required
                type="email"
                name="email"
                value={emailRequested}
                placeholder="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                onChange={(e) => {
                  setEmailRequested(e.target.value);
                }}
                style={{
                  marginTop: "10px",
                  height: "50px",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
              />
              <br />
              <button
                className="btn btn-secondary"
                style={{
                  marginTop: "10px",
                  height: "50px",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
                onSubmit={(e) => {
                  sendVisitRequest(e, each.name);
                }}
              >
                request a visit
              </button>
            </form>
          </div>
        </div>
      ))}
    </center>
  );
}

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";

// export function HousingDashBoard() {
//   const { setIsAdmin, setIsLoggedIn, setIsAddUserHidden } = useOutletContext();
//   const [appImages, setAppImages] = useState([]);
//   const [emailRequested, setEmailRequested] = useState("");
//   const [submittedSMS, setSubmittedSMS] = useState(true);

//   useEffect(() => {
//     setIsLoggedIn(false);
//     setIsAdmin(true);
//     setIsAddUserHidden(true);

//     axios.get("http://localhost:8080/housing").then((res) => {
//       setAppImages(res.data);
//     });
//   }, []);

//  async function sendVisitRequest(e, buildingName){

//   e.preventDefault();
// console.log(buildingName);
//   if(emailRequested !== ""){
//       const reqInfo = {email:emailRequested, buildingName:buildingName}
//       axios.post("http://localhost:8080/housing/emails", reqInfo)
//       setSubmittedSMS(false);
//       setEmailRequested("");
//       setTimeout(()=>{setSubmittedSMS(true)},2000)
//     }else{
//       console.log("error...")
//     }
//   }

//   return (
//     <center>
//       <h1>Housing Dashboard</h1>
//         <h2 hidden={submittedSMS} style={{color:"green"}}>Request submitted</h2>
//       {appImages.map((each, index) => (
//         <div key={index} id="dashBoard">
//           <h3>Sample Property for {each.name}</h3> <br />
//           <div>
//             <img src={each.img1} alt="loading..." width={200} height={200}/> &nbsp;&nbsp;
//             <img src={each.img2} alt="loading..." width={200} height={200}/> &nbsp;&nbsp;
//             <img src={each.img3} alt="loading..." width={200} height={200}/> &nbsp;&nbsp;
//           </div>
//           <div style={{textAlign:"right", margin:"50px"}}>
//             <form onSubmit={(e)=>{sendVisitRequest(e,each.name)}}>
//               <input
//                 required
//                 type="email"
//                 name="email"
//                 value={emailRequested}
//                 placeholder="email"
//                 pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
//                 onChange={(e)=>{setEmailRequested(e.target.value)}}

//                 /> <br />
//               <button
//                 className="btn btn-secondary"
//                 style={{marginTop:"10px"}}
//                 onSubmit={(e)=>{sendVisitRequest(e,each.name)}}
//                 >request a visit
//               </button>
//             </form>
//           </div>
//         </div>
//       ))}
//     </center>
//   );
// }

//

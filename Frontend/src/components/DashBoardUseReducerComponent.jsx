import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [{ appImages }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [emailRequested, setEmailRequested] = useState("");
  useEffect(() => {
    dispatch({ type: "SET_IS_LOGGED_IN", payload: false });
    dispatch({ type: "SET_IS_ADMIN", payload: true });
    dispatch({ type: "SET_IS_ADD_USER_HIDDEN", payload: true });

    axios.get(`${process.env.REACT_APP_SERVER_URL}/housing`).then((res) => {
      dispatch({ type: "SET_APP_IMAGES", payload: res.data });
    });
  }, []);

  async function sendVisitRequest(e, buildingName) {
    e.preventDefault();
    console.log(buildingName);
    if (emailRequested !== "") {
      const reqInfo = { email: emailRequested, buildingName: buildingName };
      axios.post(`${process.env.REACT_APP_SERVER_URL}/housing/emails`, reqInfo);
      dispatch({ type: "SET_SUBMITTED_SMS", payload: false });
      dispatch({ type: "SET_EMAIL_REQUESTED", payload: "gjf" });

      toast.success('Request Submitted!');
      
    } else {
      console.log("error...");
    }
    clearForm();
  }
  function clearForm(){
    setEmailRequested("");
  }

  return (
    <center style={{marginBottom:'100px', marginTop:"100px"}}>
      {appImages.length !== 0 ? 
      
      <div>
      {appImages.map((each, index) => (
        <div key={index} id="dashBoard">
          <h3>Sample Property for {each.name}</h3> <br />
          <div>
            <img src={each.img1} alt="loading..." width={200} height={200}/>  &nbsp;&nbsp;
            <img src={each.img2} alt="loading..." width={200} height={200}/>  &nbsp;&nbsp;
            <img src={each.img3} alt="loading..." width={200} height={200}/>  &nbsp;&nbsp;
            <img src={each.img4} alt="loading..." width={200} height={200}/>  &nbsp;&nbsp;
            <img src={each.img5} alt="loading..." width={200} height={200}/>  &nbsp;&nbsp;
          </div>
          
          <div style={{ margin: "20px" }}>
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
              />

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

     </div>
      : 
      <div className="loading-indicator" style={{marginTop:"10%"}}>
      <div className="loading-spinner"></div>
     </div>
              }
  </center>

  );
}

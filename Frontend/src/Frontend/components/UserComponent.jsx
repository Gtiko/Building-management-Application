import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

export function UserComponent() {
  const {
    setIsLoggedIn,
    listOfUsers,
    setListOfUsers,
    setIsLoginFormHidden,
    setIsAddUserHidden,
  } = useOutletContext();

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(true);
    setIsLoginFormHidden(true);
    setIsAddUserHidden(true);
  });

  function checkOut(id) {
    let newListOfUsers = listOfUsers.filter((each) => each.id !== id);
    setListOfUsers(newListOfUsers);
    navigate("/housing/login");
  }

  return (
    <center>
      <div id="userDetail">
        <h2>Welcome {state.item.fName}</h2>
        <div>
          <img src={state.item.image} alt="pos..." />
        </div>
        <div>{state.item.id}</div>
        <div>{state.item.fName}</div>
        <div>{state.item.lName}</div>
        <div>{state.item.buildingName}</div>
        <div>{state.item.email}</div>
        <div>{state.item.role}</div>

        <button
          onClick={() => {
            checkOut(state.item.id);
          }}
          className="btn btn-secondary"
          style={{ fontSize: "25px", marginLeft: "250px", marginTop: "30px" }}
        >
          CheckOut
        </button>
      </div>
    </center>
  );
}



// useContext
// import React, { useContext, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { OutletContext } from "./OutletContext";

// export function UserComponent() {
//   const {
//     setIsLoggedIn,
//     listOfUsers,
//     setListOfUsers,
//     setIsLoginFormHidden,
//     setIsAddUserHidden,
//   } = useContext(OutletContext);

//   const { state } = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsLoggedIn(true);
//     setIsLoginFormHidden(true);
//     setIsAddUserHidden(true);
//   }, [setIsLoggedIn, setIsLoginFormHidden, setIsAddUserHidden]);

//   function checkOut(id) {
//     let newListOfUsers = listOfUsers.filter((each) => each.id !== id);
//     setListOfUsers(newListOfUsers);
//     navigate("/housing/login");
//   }

//   return (
//     <center>
//       <div id="userDetail">
//         <h2>Welcome {state.item.fName}</h2>
//         <div>
//           <img src={state.item.image} alt="pos..." />
//         </div>
//         <div>{state.item.id}</div>
//         <div>{state.item.fName}</div>
//         <div>{state.item.lName}</div>
//         <div>{state.item.buildingName}</div>
//         <div>{state.item.email}</div>
//         <div>{state.item.role}</div>

//         <button
//           onClick={() => {
//             checkOut(state.item.id);
//           }}
//           className="btn btn-secondary"
//           style={{ fontSize: "25px", marginLeft: "250px", marginTop: "30px" }}
//         >
//           CheckOut
//         </button>
//       </div>
//     </center>
//   );
// }

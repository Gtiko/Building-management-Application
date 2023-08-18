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
          style={{ fontSize: "25px", width:"100%"}}
        >
          CheckOut
        </button>
      </div>
    </center>
  );
}


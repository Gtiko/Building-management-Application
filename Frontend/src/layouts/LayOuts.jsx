import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Housing.css";
import BlackBackGround from "../components/BackGroundImageUseLoader";

export function DashBoardLayOuts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginFormHidden, setIsLoginFormHidden] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [listOfProperty, setListOfProperty] = useState([]);
  const [isAddUserHidden, setIsAddUserHidden] = useState(true);
  const [requestedEmails, setRequestedEmails] = useState([]);
  const [isMsgHidden, setIsMsgHidden] = useState(true);
  const [reservedData, setReservedData] = useState([]);
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    fName: "",
    lName: "",
    age: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    buildingName: "",
    role: "",
    image: "",
  });

  function handleLogIn() {
    setIsMsgHidden(true);
    setIsLoginFormHidden(false);
  }

  function handleLogOut() {
    setIsLoggedIn(false);
    setIsLoginFormHidden(false);
    localStorage.setItem("token", "");
    navigate("/housing/login");
  }

  function handleAdmin() {
    setIsAdmin(false);
  }

  function home() {
    navigate("/housing");
    setIsLoggedIn(false);
    setIsAdmin(true);
    setIsAddUserHidden(true);
  }

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/housing/login/admin/allUsers`)
      .then((res) => {
        setListOfUsers(res.data);
        setReservedData(res.data);
      });
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/housing/login/admin/allProperty`
      )
      .then((res) => {
        setListOfProperty(res.data);
      });
  }, []);

  return (
    <>
      <div id="home">
        <Link to="/housing" onClick={home}>
          <h2 style={{ cursor: "pointer", color: "white" }} id="housing"> </h2>
        </Link>

        <h2>
          <Link
            to="/housing/login/admin/"
            hidden={isAdmin}
            onClick={handleAdmin}
          >
            <span id="backArrow"></span>
          </Link>
          &nbsp;
          <Link
            to="/housing/login/admin/addUser"
            hidden={isAddUserHidden}
            style={{ textAlign: "left", color: "white" }}
          >
            <span id="addUser"> </span>
          </Link>
          &nbsp;
          <Link
            to="/housing/login"
            hidden={isLoggedIn}
            onClick={handleLogIn}
            style={{ textAlign: "left", color: "white" }}
          >
            <span id="loginIcon"></span>
          </Link>
          &nbsp;
          <Link
            to="/housing/login"
            hidden={!isLoggedIn}
            onClick={handleLogOut}
            style={{ textAlign: "left", color: "white" }}
          >
            <span id="logout"></span>
          </Link>
          &nbsp;
          <BlackBackGround />
        </h2>
      </div>
      <Outlet
        context={{
          isAdmin,
          setIsAdmin,
          isLoggedIn,
          setIsLoggedIn,
          listOfUsers,
          setListOfUsers,
          listOfProperty,
          setListOfProperty,
          isLoginFormHidden,
          setIsLoginFormHidden,
          isMsgHidden,
          setIsMsgHidden,

          userInfo,
          setUserInfo,
          gender,
          setGender,
          setIsAddUserHidden,
          requestedEmails,
          setRequestedEmails,

          reservedData,
        }}
      />
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export function AddComponents() {
  const {
    setIsAdmin,
    setIsLoggedIn,
    listOfUsers,
    listOfProperty,
    setListOfProperty,
    setIsLoginFormHidden,
    setIsAddUserHidden,

    userInfo,
    setUserInfo,
    gender,
    setGender,
  } = useOutletContext();
  const [isEmailSMS, setIsEmailSMS] = useState(true);
  const [adminCanAccessSMS, setAdminCanAccessSMS] = useState(false);
  const [successSMS, setSuccessSMS] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false);
    setIsLoginFormHidden(true);
    setIsLoggedIn(true);
    setIsAddUserHidden(true);

    (async()=>{
      const isEmailExist = await axios.get(
        "http://localhost:8080/housing/login/admin",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if(isEmailExist.data === "Invalid token" || 
        isEmailExist.data === "You are not allowed only for admins"){
        navigate("/housing/login");
      }
      console.log("isEmailExist", isEmailExist.data);
    })();

  });

  function handleGender(e) {
    setGender(e.target.value);
  }

  function handleChanges(e) {
    const { name, value } = e.target;
    setUserInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let imageUrl = `https://randomuser.me/api/portraits/men/${Math.floor(
      Math.random() * 99
    )}.jpg`;

    let newUser = {
      ...userInfo,
      id: uuidv4().slice(0, 4),
      gender: gender,
      image: imageUrl,
    };

    const isEmailExist = await axios.post(
      "http://localhost:8080/housing/login/admin/addNewUser",
      newUser,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
      console.log(isEmailExist.data)
    if (isEmailExist.data === "Invalid token") {
      setAdminCanAccessSMS(true);
    }
    if(isEmailExist.data === "You are not allowed only for admins"){
      setAdminCanAccessSMS(true);
    }
    if (isEmailExist.data === "This email already registered!") {
      setIsEmailSMS(false);
      document.getElementById("email").style.borderBlockColor = "red";
    } else {
      console.log("newUser: ", newUser);
      listOfUsers.push(newUser);
      setIsEmailSMS(true);
      document.getElementById("email").style.borderBlockColor = "";
    }

    const bld = newUser.buildingName;
    let property = [...listOfProperty];
    for (let each of property) {
      if (each.buildingName === bld) {
        each.vacancies = each.vacancies - 1;
        break;
      }
    }
    setListOfProperty(listOfProperty);
    clearForm();
    if(!adminCanAccessSMS){
    setSuccessSMS(false)
    setTimeout(()=>{setSuccessSMS(true)}, 1000)
    }
  }

  function clearForm(){
    setUserInfo({
        fName:"",
        lName:"",
        age:"",
        email:"",
        phone:"",
        address:"",
        role:"",
        buildingName:"",
        password:""
    })
  }

  return (
    <center>
      <h1>Add newUser</h1>
      <h1 style={{color:"green"}} hidden={successSMS} >user Added successfully </h1>
      <form id="ADD_EDIT" onSubmit={handleSubmit}>
        <div>
          <h2 hidden={!adminCanAccessSMS} style={{ color: "red" }}>
            Only Admin Can Add users
          </h2>
          <div hidden={adminCanAccessSMS}>
            First Name: <br />
            <input
              required
              type="text"
              name="fName"
              value={userInfo.fName}
              placeholder="First Name"
              onChange={handleChanges}
            />
            <br />
            Last Name: <br />
            <input
              required
              type="text"
              name="lName"
              value={userInfo.lName}
              placeholder="Last Name"
              onChange={handleChanges}
            />
            <br />
            Age: <br />
            <input
              required
              type="number"
              name="age"
              value={userInfo.age}
              placeholder="Age"
              onChange={handleChanges}
            />
            <br />
            Address: <br />
            <input
              required
              type="text"
              name="address"
              value={userInfo.address}
              placeholder="Address"
              onChange={handleChanges}
            />
            <br />
            Phone Number: <br />
            <input
              required
              type="number"
              name="phone"
              value={userInfo.phone}
              placeholder="Phone Number"
              onChange={handleChanges}
            />
          </div>
        </div>

        <div hidden={adminCanAccessSMS}>
          <div id="emailSMS" hidden={isEmailSMS} style={{ color: "red" }}>
            This email already exist
          </div>
          Email Address: <br />
          <input
            required
            id="email"
            type="email"
            name="email"
            value={userInfo.email}
            placeholder="Email"
            onChange={handleChanges}
          />
          <br />
          Password: <br />
          <input
            required
            type="password"
            name="password"
            value={userInfo.password}
            placeholder="password"
            onChange={handleChanges}
          />
          <br />
          Gender: <br />
          Male
          <input
            type="radio"
            name="male"
            value="male"
            checked={gender === "male"}
            onChange={handleGender}
          />
          Female
          <input
            type="radio"
            name="female"
            value="female"
            checked={gender === "female"}
            onChange={handleGender}
          />
          <br /> <br />
          Role: <br />
          <select name="role" value={userInfo.role} onChange={handleChanges}>
            <option value="role">Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <br /> <br />
          Property for Rent: <br />
          <select
            name="buildingName"
            value={userInfo.buildingName}
            onChange={handleChanges}
          >
            <option>Buildings</option>
            {listOfProperty.map((each, index) => (
              <option
                key={index}
                name={each.buildingName}
                value={each.buildingName}
              >
                {each.buildingName}
              </option>
            ))}
          </select>
          <br />
          <button
            className="btn btn-secondary"
            style={{ fontSize: "20px", marginTop: "10px" }}
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </center>
  );
}

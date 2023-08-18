import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function EditComponent() {
  const {
    setIsAdmin,
    setIsLoggedIn,
    listOfUsers,
    listOfProperty,
    setListOfUsers,
    setIsLoginFormHidden,

    userInfo,
    setUserInfo,
    gender,
    setGender,
  } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false);
    setIsLoginFormHidden(true);
    setIsLoggedIn(true);


    (async()=>{
      const isEmailExist = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/housing/login/admin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if(isEmailExist.data === "Invalid token" || isEmailExist.data === "You are not allowed only for admins"){
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
  async function updateUser() {
    let newUpdatedUserData = { ...userInfo, gender: gender };

    const isEmailExist = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/housing/login/admin/updateUser/${userInfo.id}`,
      newUpdatedUserData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    let newUpdatedData = [...listOfUsers];

    if (isEmailExist.data === "Invalid token") {
      toast.error("Invalid token!");
      return;
    }
    if (isEmailExist.data === "This email already registered!") {
      toast.error("Invalid token!");
      document.getElementById("email").style.borderBlockColor = "red";
      return;
    } else {
      setListOfUsers(newUpdatedData);
      document.getElementById("email").style.borderBlockColor = "";
      toast.success("User Updated!")
    }

    for (let each of newUpdatedData) {
      if (each.id === userInfo.id) {
        each.fName = userInfo.fName;
        each.lName = userInfo.lName;
        each.age = userInfo.age;
        each.address = userInfo.address;
        each.phone = userInfo.phone;
        each.email = userInfo.email;
        each.gender = gender;
        each.buildingName = userInfo.buildingName;
      }
    }
    clearForm();
    
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
      <h1>Edit user</h1>
      <form id="ADD_EDIT">
          <div >
            First Name: <br />
            <input
              type="text"
              name="fName"
              value={userInfo.fName}
              placeholder="First Name"
              onChange={handleChanges}
            />
            <br />
            Last Name: <br />
            <input
              type="text"
              name="lName"
              value={userInfo.lName}
              placeholder="Last Name"
              onChange={handleChanges}
            />
            <br />
            Age: <br />
            <input
              type="number"
              name="age"
              value={userInfo.age}
              placeholder="Age"
              onChange={handleChanges}
            />
            <br />
            Address: <br />
            <input
              type="text"
              name="address"
              value={userInfo.address}
              placeholder="Address"
              onChange={handleChanges}
            />
            <br />
          </div>

        <div >
          Phone Number: <br />
          <input
            type="number"
            name="phone"
            value={userInfo.phone}
            placeholder="Phone Number"
            onChange={handleChanges}
          />
          <br />
          Email Address: <br />
          <input
            id="email"
            type="email"
            name="email"
            value={userInfo.email}
            placeholder="Email"
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
          <br />
          List of property for Rent: <br />
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
        </div>
      </form>
      <div>
        <button
          className="btn btn-secondary"
          style={{ fontSize: "20px", marginTop: "10px" }}
          onClick={updateUser}
        >
          update
        </button>
      </div>
    </center>
  );
}

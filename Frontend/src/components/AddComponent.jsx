import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false);
    setIsLoginFormHidden(true);
    setIsLoggedIn(true);
    setIsAddUserHidden(true);

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
      `${process.env.REACT_APP_SERVER_URL}/housing/login/admin/addNewUser`,
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
      navigate("/housing/login");
      toast.error('Invalid token');
    }
    if(isEmailExist.data === "You are not allowed only for admins"){
      navigate("/housing/login");
      toast.error('You are not allowed only for admins');
    }
    if (isEmailExist.data === "This email already registered!") {
      document.getElementById("email").style.borderBlockColor = "red";
      toast.error('This email already registered!');
    } else {
      console.log("newUser: ", newUser);
      listOfUsers.push(newUser);
      document.getElementById("email").style.borderBlockColor = "";
      clearForm();
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
      <form id="ADD_EDIT" onSubmit={handleSubmit}>
        
          <div>
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

        <div>
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

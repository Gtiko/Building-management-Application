import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function AdminComponent() {
  
const [searchName, setSearchName] = useState("");
const [showUserTable, setShowUserTable] =useState(false)
const [showPropertyTable, setShowPropertyTable] =useState(true)

  const navigate = useNavigate();
  const {
    setIsAdmin,
    setIsLoggedIn,
    listOfUsers,
    setListOfUsers,
    listOfProperty,
    setListOfProperty,
    setIsLoginFormHidden,
    setIsAddUserHidden,

    setUserInfo,
    requestedEmails, 
    setRequestedEmails,

    reservedData
  } = useOutletContext();

  useEffect(() => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setIsLoginFormHidden(true);
    setIsAddUserHidden(false);
    axios.get(`${process.env.REACT_APP_SERVER_URL}/housing/emails`).then((res) => {
      setRequestedEmails(res.data);
    });


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

  },[]);

  function showDetail(id) {
    navigate(`/housing/login/admin/details/${id}`, {
      state: { data: listOfUsers },
    });
  }

  function deleteUser(id, buildingName) {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/housing/login/admin/deleteUser/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      
    });
    const existingUsers = listOfUsers.filter((each) => each.id !== id);
    setListOfUsers(existingUsers);
    
    toast.success('User Deleted');

    // FIXME: the update must work without using this for loop its is already updated in the backend!
    let newBuilding = [...listOfProperty];
    for (let each of newBuilding) {
      if (each.buildingName === buildingName) {
        each.vacancies = each.vacancies + 1;
        break;
      }
    }
    setListOfProperty(listOfProperty);
  }

  function editUser(user) {
    navigate(`/housing/login/admin/updateUser/${user.id}`);
    setUserInfo({
      id: user.id,
      fName: user.fName,
      lName: user.lName,
      age: user.age,
      address: user.address,
      phone: user.phone,
      email: user.email,
      password: user.password,
      buildingName: user.buildingName,
    });
    console.log(user.id);
  }

  function searchUser(){
    if(searchName === "" || searchName === " "){
      setListOfUsers(reservedData);
    }else{
      const findUser = listOfUsers.filter(each=> 
        each.fName.toLowerCase() === searchName.toLowerCase() ||
        each.lName.toLowerCase() === searchName.toLowerCase() ||
        each.email.toLowerCase() === searchName.toLowerCase() ||
        each.buildingName.toLowerCase() === searchName.toLowerCase()
      );
      if(findUser.length !== 0){
        setListOfUsers(findUser);
      }
    }
  }

  return (
  <div style={{marginBottom:'100px', marginTop: '100px'}}>
      <div style={{ textAlign:"end" , marginRight:"50px",fontSize:"30px" }}>
        <Link to= "/housing/visiters">
           Requesters  
          <label style={{ color: "red" , marginLeft:"20px"}}>({requestedEmails.length})</label>
        </Link>
      </div>
      <center>
        <div>
          
          <input 
              type="text" 
              value={searchName}
              onChange={(e)=>{setSearchName(e.target.value)}}
              style={{width:"50%"}}
          />  &nbsp;&nbsp;
          <button
              onClick={searchUser}
              className="btn btn-secondary"
              style={{ fontSize: "25px" }}
          >
            search
          </button> <br /> <br />

        <div id="listBTN">

          <button
          className="btn btn-secondary"
          style={{  marginLeft:"10%", borderColor:"white" }}
            onClick={()=>{
              setShowUserTable(false);
              setShowPropertyTable(true)
            }}
          >List of users</button>

          <button
          className="btn btn-secondary"
          style={{  width:'90%' }}          
          onClick={()=>{
              setShowUserTable(true);
              setShowPropertyTable(false)
            }}
          >List of property</button>
        </div>
          

          <table hidden={showUserTable}>
            <thead>
              <tr>
                <th>Id</th>
                <th>User</th>
                <th>Photo</th>
                <th style={{width:"200px"}}>Detail</th>
                <th style={{width:"300px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {listOfUsers.map((user, indx) =>
                user.role !== "admin" ? (
                  <tr key={indx}>
                    <td>{user.id}</td>
                    <td>
                      {user.fName} {user.lName}
                    </td>
                    <td>
                      <img id="userImages" src={user.image} alt="ops.." />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          showDetail(user.id);
                        }}
                        className="btn btn-secondary"
                        style={{ width:"100%", height:"100%" }}
                      >
                        details
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          editUser(user);
                        }}
                        className="btn btn-warning"
                        style={{ width:"100%" }}
                      >
                        edit
                      </button> 
                      <button
                        onClick={() => {
                          deleteUser(user.id, user.buildingName);
                        }}
                        className="btn btn-danger"
                        style={{ width:"100%" }}
                      >
                        remove
                      </button>
                    </td>
                  </tr>
                ) : (
                  ""
                )
              )}
            </tbody>
          </table>
        </div>

        <div>
          {/* <h1>List of property</h1> */}
          <table hidden={ showPropertyTable}>
            <thead>
              <tr>
                <th>Building Id</th>
                <th>Building Name</th>
                <th>Building Address</th>
                <th>Available Apartment</th>
              </tr>
            </thead>
            <tbody>
              {listOfProperty.map((each, index) => (
                <tr key={index}>
                  <td>{each.id}</td>
                  <td>{each.buildingName}</td>
                  <td>{each.address}</td>
                  <td>{each.vacancies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
    </div>
  );
}

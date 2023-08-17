import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

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
    axios.get("http://localhost:8080/housing/emails").then((res) => {
      setRequestedEmails(res.data);
    });


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

  },[]);

  function showDetail(id) {
    navigate(`/housing/login/admin/details/${id}`, {
      state: { data: listOfUsers },
    });
  }

  function deleteUser(id, buildingName) {
    axios.delete(`http://localhost:8080/housing/login/admin/deleteUser/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const existingUsers = listOfUsers.filter((each) => each.id !== id);
    setListOfUsers(existingUsers);

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
    <>
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

        <div  
          style={{display:"grid", gridTemplateColumns:"auto auto",gap:"10px", marginBottom:"30px"}}>

          <button
          className="btn btn-secondary"
          style={{ fontSize: "25px", marginLeft:"60px", borderColor:"white" }}
            onClick={()=>{
              setShowUserTable(false);
              setShowPropertyTable(true)
            }}
          >List of users</button>

          <button
          className="btn btn-secondary"
          style={{ fontSize: "25px", marginRight:"30px" }}          
          onClick={()=>{
              setShowUserTable(true);
              setShowPropertyTable(false)
            }}
          >List of property</button>
        </div>
          

          <table hidden={showUserTable}>
            <thead>
              <tr>
                <th>userId</th>
                <th>user full name</th>
                <th>photo</th>
                <th style={{width:"200px"}}>user detail</th>
                <th style={{width:"300px"}}>action</th>
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
                        style={{ fontSize: "25px", width:"100%" }}
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
                        style={{ fontSize: "25px", width:"30%" }}
                      >
                        edit
                      </button>{" "}
                      &nbsp;&nbsp;
                      <button
                        onClick={() => {
                          deleteUser(user.id, user.buildingName);
                        }}
                        className="btn btn-danger"
                        style={{ fontSize: "25px",width:"60%" }}
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
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LoginComponent() {
  const {
    listOfUsers,
    isLoginFormHidden,
    setIsLoginFormHidden,
    setIsAddUserHidden,
  } = useOutletContext();

  useEffect(() => {
    setIsAddUserHidden(true);
    setIsLoginFormHidden(false);
  });

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  function handleLoginInfo(e) {
    const { name, value } = e.target;
    setLoginInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  async function loginBtn(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/housing/login/auth`, {
          email: loginInfo.email,
          password: loginInfo.password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data);

          if (res.data === "Please check your email") {
            toast.error('Wrong username or password');
            setIsLoading(false);
          } else if (res.data === "Please check your password") {
            toast.error('Wrong username or password');
            setIsLoading(false);
          } else {
            const user = listOfUsers.find(
              (each) => each.email === loginInfo.email
            );
            if (user && user.role === "admin") {
              navigate("/housing/login/admin", {
                state: { user },
              });
            } else if (user && user.role === "user") {
              navigate(`/housing/login/user/${user.id}`, {
                state: { item: user, data: listOfUsers },
              });
            } 
          }

        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <center id="login">

    { isLoading ? 
    <div className="loading-indicator"  >
          <div className="loading-spinner"></div>
    </div>
    : ""
    }

      <form onSubmit={loginBtn} hidden={isLoginFormHidden}>
        <h1 style={{marginBottom:"30px"}}>Login</h1>
        <input
          required
          type="email"
          name="email"
          placeholder="email"
          value={loginInfo.email}
          onChange={handleLoginInfo}
          style={{width:"100%"}}

        />
        <br />
        <input
          required
          type="password"
          name="password"
          placeholder="password"
          value={loginInfo.password}
          onChange={handleLoginInfo}
          style={{width:"100%"}}
        />

        <button 
          onSubmit={loginBtn}
          className="btn btn-secondary"
          style={{fontSize:"25px", width:'100%', marginBottom:"20px"}}
        >Login</button>

        
      </form>
    </center>
  );
}

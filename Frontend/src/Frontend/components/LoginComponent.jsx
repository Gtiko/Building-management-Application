import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

export function LoginComponent() {
  const {
    listOfUsers,
    isLoginFormHidden,
    setIsLoginFormHidden,
    isMsgHidden,
    setIsMsgHidden,
    setIsAddUserHidden,
  } = useOutletContext();

  useEffect(() => {
    setIsAddUserHidden(true);
    setIsLoginFormHidden(false);
  });

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
    try {
      axios
        .post("http://localhost:8080/housing/login/auth", {
          email: loginInfo.email,
          password: loginInfo.password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data);

          if (res.data === "Please check your email") {
            console.log("email problem");
            setIsMsgHidden(false);
            setTimeout(()=>{setIsMsgHidden(true)}, 2000)
          } else if (res.data === "Please check your password") {
            console.log("password problem");
            setIsMsgHidden(false);
            setTimeout(()=>{setIsMsgHidden(true)}, 2000)
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
            } else {
              console.log("doesn't have role... ");
              setIsMsgHidden(false);
            }
          }
          console.log("result", res.data);
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
      <form onSubmit={loginBtn} hidden={isLoginFormHidden}>
        <h1 style={{marginBottom:"30px"}}>Login</h1>
        <h3 hidden={isMsgHidden} style={{ color: "red" }}>
          wrong username or password
        </h3>
        <input
          required
          type="email"
          name="email"
          placeholder="email"
          value={loginInfo.email}
          onChange={handleLoginInfo}

        />
        <br />
        <input
          required
          type="password"
          name="password"
          placeholder="password"
          value={loginInfo.password}
          onChange={handleLoginInfo}
        />
        <br />
        <button 
          onSubmit={loginBtn}
          className="btn btn-secondary"
          style={{fontSize:"25px", marginLeft:"300px", marginTop:"30px"}}
        >Login</button>

        
      </form>
    </center>
  );
}

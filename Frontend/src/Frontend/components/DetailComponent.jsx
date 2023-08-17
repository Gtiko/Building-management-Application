import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";

export function DetailComponent() {
  const { state } = useLocation();
  const { userId } = useParams();
  const { setIsAdmin } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false);

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
      if(isEmailExist.data === "Invalid token" || isEmailExist.data === "You are not allowed only for admins"){
        navigate("/housing/login");
      }
      console.log("isEmailExist", isEmailExist.data);
    })();
  });

  const userData = state.data.filter((each) => each.id === userId);

  return (
    <div id="Detail" style={{ textAlign: "center" }}>
      <h1>Detail for {userData[0].fName}</h1> <br />
      <div>
        {userData.map((each, index) => (
          <div key={index}>
            <div>
              <img src={each.image} alt="ops.." />
            </div> <br />
            <div>{each.id} </div>
            <div>{each.fName} </div>
            <div>{each.lName} </div>
            <div>{each.email} </div>
            <div>{each.buildingName} </div>
            <div>{each.role} </div>
            <div>{each.password} </div>
          </div>
        ))}
      </div>
    </div>
  );
}

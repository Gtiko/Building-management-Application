import React from "react";
import axios from "axios";

export class VisitRequesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestedEmails: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("http://localhost:8080/housing/emails");
      this.setState({
        requestedEmails: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  removeRequest = async (removedEmail) => {
    try {
      await axios.delete(
        `http://localhost:8080/housing/emails/${removedEmail}`
      );
      const undeletedRequest = this.state.requestedEmails.filter(
        (each) => each.email !== removedEmail
      );
      this.setState({
        requestedEmails: undeletedRequest,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { requestedEmails } = this.state;

    return (
      <center>
        <h1 style={{marginBottom:"20px"}}> Visit Requesters </h1>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Requested building</th>
              <th style={{width:"250px"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedEmails.map((each, index) => (
              <tr key={index}>
                <td><a href="mailto:cshelpdesk@mum.edu">{each.email}</a></td>
                <td>{each.buildingName}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: "20px", width:"100%"}}
                    onClick={() => {
                      this.removeRequest(each.email);
                    }}
                  >
                    remove request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    );
  }
}


// using functional component
// import axios from "axios";
// import { useEffect } from "react";
// import { useOutletContext } from "react-router-dom";

// export function Requesters() {

//   const {requestedEmails,
//     setRequestedEmails
//   } = useOutletContext();

//   async function removeRequest(removedEmail){
//     axios.delete(`http://localhost:8080/housing/emails/${removedEmail}`);
//     const undeletedRequest = requestedEmails.filter(each => each.email !== removeRequest)
//     setRequestedEmails(undeletedRequest);
//   }

//   useEffect(()=>{
//     axios.get("http://localhost:8080/housing/emails").then((res) => {
//       setRequestedEmails(res.data);
//     });
//   },[]);

//   return (
//     <>
//       <h1> Visit Requesters </h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Requested building</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requestedEmails.map((each, index) => (
//             <tr key={index}>
//               <td> {each.email}</td>
//               <td>{each.buildingName}</td>
//               <td>
//                 <button
//                   className="btn btn-danger"
//                   onClick={()=>{removeRequest(each.email)}}
//                 >remove request</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// }
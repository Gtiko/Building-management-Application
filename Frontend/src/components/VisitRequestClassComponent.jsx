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
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/housing/emails`
      );
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
        `${process.env.REACT_APP_SERVER_URL}/housing/emails/${removedEmail}`
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
        <h1 style={{ marginBottom: "20px" }}> Visit Requesters </h1>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Requested building</th>
              <th style={{ width: "250px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestedEmails.map((each, index) => (
              <tr key={index}>
                <td>
                  <a href="mailto:cshelpdesk@mum.edu">{each.email}</a>
                </td>
                <td>{each.buildingName}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: "20px", width: "100%" }}
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

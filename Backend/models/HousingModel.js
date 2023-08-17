const fs = require("fs");
const userData = require("./userData.json");
const propertyData = require("./propertyData.json");
const ApartmentImages = require("./Images.json");
const requestedEmails = require("./requestEmail.json");

class Housing {
  static async getAllUsers() {
    try {
      return userData;
    } catch (error) {
      return error;
    }
  }
  static async getAllProperty() {
    try {
      return propertyData;
    } catch (error) {
      return error;
    }
  }

  static async getAllImages() {
    try {
      return ApartmentImages;
    } catch (error) {
      return error;
    }
  }

  static async getRequestedEmail() {
    try {
      return requestedEmails;
    } catch (error) {
      return error;
    }
  }

  static async saveVisitRequest(info) {
    try {
      let newVisitRequest = [...requestedEmails];
      newVisitRequest.push(info);
      fs.writeFileSync(
        "./models/requestEmail.json",
        JSON.stringify(newVisitRequest),
        (error) => {
          throw error;
        }
      );
      return "request submitted!"
    } catch (error) {
      return error;
    }
  }

  static async removeRequest(email){
    try {
      const updatedRequest = requestedEmails.filter(each => each.email !== email);
      fs.writeFileSync(
        "./models/requestEmail.json",
        JSON.stringify(updatedRequest),
        (error) => {
          throw error;
        }
      );
      return "request removed!"
    } catch (error) {
      return error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await userData.find((user) => user.email === email);
      return user;
    } catch (error) {
      return error;
    }
  }
  static async addNewUser(newUser) {
    try {
      userData.push(newUser);
      const userBuilding = newUser.buildingName;
      console.log(userBuilding);
      this.vacancies(userBuilding, "decrease");

      console.log("dec");

      fs.writeFileSync(
        "./models/userData.json",
        JSON.stringify(userData),
        (error) => {
          throw error;
        }
      );
      return "new user added successfully";
    } catch (error) {
      return error;
    }
  }

  static async vacancies(userBuilding, changeVacancies) {
    let newBuildingData = [...propertyData];

    if (changeVacancies === "increase") {
      for (let each of newBuildingData) {
        if (each.buildingName === userBuilding) {
          each.vacancies = each.vacancies + 1;
          console.log(each.vacancies);
          break;
        }
      }
    }

    if (changeVacancies === "decrease") {
      for (let each of newBuildingData) {
        if (each.buildingName === userBuilding) {
          each.vacancies = each.vacancies - 1;
          console.log(each.vacancies);
          break;
        }
      }
    }

    fs.writeFileSync(
      "./models/propertyData.json",
      JSON.stringify(newBuildingData),
      (error) => {
        throw error;
      }
    );
  }

  static async deleteUser(userId) {
    try {
      const newUserData = userData.filter((user) => user.id !== userId);
      const userBuilding = userData.find(
        (user) => user.id === userId
      ).buildingName;
      fs.writeFileSync(
        "./models/userData.json",
        JSON.stringify(newUserData),
        (error) => {
          throw error;
        }
      );
      this.vacancies(userBuilding, "increase");
      return "user deleted successfully";
    } catch (error) {
      console.log("error");
      return error;
    }
  }

  static async updateUser(userId, updatedData) {
    try {
      let newUserData = [...userData];
      for (let each of newUserData) {
        if (each.id === userId) {
          each.fName = updatedData.fName;
          each.lName = updatedData.lName;
          each.age = updatedData.age;
          each.address = updatedData.address;
          each.phone = updatedData.phone;
          each.email = updatedData.email;
          each.gender = updatedData.gender;
          each.buildingName = updatedData.buildingName;
        }
      }
      console.log("Updated Data:", updatedData);
      fs.writeFileSync(
        "./models/userData.json",
        JSON.stringify(newUserData),
        (error) => {
          throw error;
        }
      );
      return "Updated successfully!";
    } catch (error) {
      console.log("error");
      return error;
    }
  }
}

module.exports = Housing;

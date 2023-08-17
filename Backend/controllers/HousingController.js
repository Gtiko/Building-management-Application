const HousingModel = require("../models/HousingModel");
const bcrypt = require("bcrypt");

exports.getAllUsers = async function (req, res) {
  try {
    const allUsers = await HousingModel.getAllUsers();
    res.status(200).send(JSON.stringify(allUsers));
  } catch (error) {
    res.send(error.message);
  }
};

exports.getAllProperty = async function (req, res) {
  try {
    const allProperty = await HousingModel.getAllProperty();
    res.status(200).send(JSON.stringify(allProperty));
  } catch (error) {
    res.send(error.message);
  }
};

exports.getAllImages = async function (req, res) {
  try {
    const allImages = await HousingModel.getAllImages();
    res.status(200).send(allImages);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getRequestedEmail = async function (req, res) {
  try {
    const emails = await HousingModel.getRequestedEmail();
    res.status(200).send(emails);
  } catch (error) {
    res.send(error.message);
  }
};

exports.saveVisitRequest = async function (req, res) {
  try {
    const request = await HousingModel.saveVisitRequest(req.body);
    res.send(request);
  } catch (error) {
    res.send(error.message);
  }
};

exports.removeRequest = async function (req, res) {
  try {
    const { email } = req.params;
    console.log("email", email);
    const result = await HousingModel.removeRequest(email);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

exports.addNewUser = async function (req, res) {
  try {
    const newUser = req.body;
    const { password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    newUser.password = hashed;
    let addSMS = await HousingModel.addNewUser(newUser);
    res.send(addSMS);
  } catch (error) {
    return error.message;
  }
};

exports.deleteUser = async function (req, res) {
  try {
    const { userId } = req.params;
    console.log("first");
    const deleteSMS = await HousingModel.deleteUser(userId);
    res.send(deleteSMS);
  } catch (error) {
    return error.message;
  }
};

exports.updateUser = async function (req, res) {
  try {
    const { userId } = req.params;
    const updatedData = req.body;
    const result = await HousingModel.updateUser(userId, updatedData);
    res.send(result);
  } catch (error) {
    console.log("error");
    return error;
  }
};

const jwt = require("jsonwebtoken");
const PRIVATE_KEY = "REACT";
const HousingModel = require("../models/HousingModel");
const bcrypt = require("bcrypt");

exports.authLogin = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    let loginData = await HousingModel.findUserByEmail(email);

    if (!loginData) {
      return res.send("Please check your email");
    }
    if (!bcrypt.compareSync(password, loginData.password)) {
      console.log(bcrypt.compareSync(password, loginData.password))
      return res.send("Please check your password");
    }
    const token = jwt.sign(
      {
        email,
        role: loginData.role,
      },
      PRIVATE_KEY
    );
    res.send(token);
  } catch (error) {
    console.log("error");
  }
};

exports.validateAdmin = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.send("Invalid token");
      return next(new Error("Invalid token"));
    }
    const arr = req.headers.authorization.split(" ");
    if (arr.length !== 2) {
      res.send("Invalid token");
      return next(new Error("Please use bearer schema"));
    }
    const token = arr[1];

    console.log("token from validateAdmin: ", token);
    const payload = jwt.verify(token, PRIVATE_KEY);

    if (payload.role === "admin") {
      next();
    } else {
      res.send("You are not allowed only for admins");
    }
  } catch (error) {
    console.log("Invalid token");
    res.send("Invalid token");
  }
};

exports.authAddUser = async function (req, res, next) {
  try {
    const { email } = req.body;
    const emailExist = await HousingModel.findUserByEmail(email);
    if (emailExist) {
      return res.send("This email already registered!");
    } else {
      next();
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.authenticateToken = function (req, res, next) {
  console.log("sos...");
  // Read the JWT access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // Return 401 if no token

  // Verify the token using the Userfront public key
  jwt.verify(token, PRIVATE_KEY, (err, auth) => {
    if (err) return res.sendStatus(403); // Return 403 if there is an error verifying
    req.auth = auth;
    // next();
    console.log("first");
  });
  res.send("ok")
};

exports.authEmailUpdate = async function (req, res, next) {
  try {
    const { id, email } = req.body;
    console.log("email: ", email);
    const allUsers = await HousingModel.getAllUsers();

    for (let each of allUsers) {
      if (each.id === id) {
        continue;
      }
      if (each.email === email) {
        console.log("email already exist");
        return res.send("This email already registered!");
      }
    }
    next();
  } catch (error) {
    console.log("error authEmailUpdate...");
    res.send(error.message);
  }
};

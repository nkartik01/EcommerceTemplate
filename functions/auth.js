const jwt = require("jsonwebtoken");
const insert = require("./crud/insert.js");
const get = require("./crud/get.js");
const update = require("./crud/update");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const auth_user = require("./middlewares/auth_user");
const config = require("config");
// const { request } = require("node:http");
//do two step verification while login also
//send encrypted password
//make edit profile route
//log new event option --> increase coins in helper user profile

router.post("/signup", async (req, res) => {
  const { name, password, phone } = req.body;
  try {
    var user = await get({
      collection: "user",
      by: "where",
      where: [{ parameter: "phone", comparison: "==", value: phone }],
    });

    if (user.length != 0) {
      return res.status(400).send("Phone already in use. Please Login!");
    }
    var salt = await bcrypt.genSalt(12);

    var hash = await bcrypt.hash(password, salt);
    await insert({
      collection: "user",
      data: { name, password: hash, phone: phone },
    });
    return res.send("User added successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    var user = await get({
      collection: "user",
      by: "where",
      where: [{ parameter: "phone", comparison: "==", value: phone }],
    });
    if (user.length === 0) {
      return res.status(400).send("Invalid Credentials.");
    }
    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      return res.status(400).send("Invalid Credentials.");
    }
    // console.log(process.env.JWT_SIGNIN_KEY)
    const token = jwt.sign(
      { user: { id: user[0].id } },
      config.get("JWTSecretUser")
    );
    res.json({
      token,
      user: user,
      id: user[0].id,
      error: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.toString());
  }
});

router.get("/validate", auth_user, async (req, res) => {
  try {
    return res.send({ user: req.user.id });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
});

module.exports = router;

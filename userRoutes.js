const express = require("express");
const router = express.Router();
const userModel = require("./userModel");
const emailer = require("./emailer");

router.post("/addUser", (req, res) => {
  const user = new userModel({
    email: req.body.email,
    password: req.body.password,
    createdTime: Date.now(),
    provider: req.body.provider,
    userName: req.body.uName,
    data: req.body.data,
  });

  user
    .save()
    .then((data) => {
      res.json({ code: "SR", message: "User added sucessfully" });
    })
    .catch((err) => {
      res.json({
        code: "ER",
        message: "There was an error processing your request",
      });
    });
});

router.post("/checkUser", (req, res) => {
   
  const userF = userModel.find({ email: req.body.email }, function (err, docs) {
    if (err) {
      res.json({
        code: "ER",
        message: "There was an error processing your request",
      });
    } else {
      if (docs[0]) {
        if (docs[0].password === req.body.password) {
          res.json({ code: "SR", message: "Login Successful", option: docs[0]?.options}); //,'data':docs[0]
        } else {
          res.json({
            code: "ER",
            message: "Password is incorrect, Please try again ",
          });
        }
      } else {
        res.json({
          code: "ER",
          message: "Email Id does not exsist kindly Sign Up",
        });
      }
    }
  });
});

router.post("/resendPassword", (req, res) => {
  const userF = userModel.find({ email: req.body.email }, function (err, docs) {
    if (err) {
      res.json({
        code: "ER",
        message: "There was an error processing your request",
      });
    } else {
      if (docs[0]) {
        emailer.sendPass(req.body.email, docs[0].password);
        res.json({ code: "SR", message: "Password has been sent to your email ID" });
      } else {
        res.json({
          code: "ER",
          message: "Email Id does not exsist kindly Sign Up",
        });
      }
    }
  });
});

router.post("/addOptions", async (req, res) => {
  
  if (!req.body.email) {
    res.json({
      code: "ER",
      message: "Email not found",
    });
  }

  const updated = await userModel.updateOne({ email: req.body.email }, 
    {$push: {options: {wallet: req.body.wallet, option: req.body.option}}})

  const user = await userModel.findOne({ email: req.body.email })
  
  if (updated?.acknowledged) {
    res.json({ code: "SR", message: "Option added sucessfully", options: user?.options});
  } else {
    res.json({
      code: "ER",
      message: "Something went wrong",
    });
  }
});

router.post("/updateOptions", async (req, res) => {

  if (!req.body.email) {
    res.json({
      code: "ER",
      message: "Email not found",
    });
  }

  const user = await userModel.findOne({ email: req.body.email })
  
  const updatedOptions = user?.options?.filter(o => o.option !== req.body.option)

  const updated = await userModel.updateOne({ email: req.body.email }, 
                    {$set: {options: updatedOptions}})

  // const updated = await userModel.updateOne({ email: req.body.email }, 
  //                   {$set: {wallet: req.body.wallet, option: req.body.option}})
  
  if (updated?.acknowledged) {
    res.json({ code: "SR", message: "Option updated sucessfully" });
  } else {
    res.json({
      code: "ER",
      message: "Something went wrong",
    });
  }
});

module.exports = router;

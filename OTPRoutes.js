const express = require("express");
const router = express.Router();
const OTPModel = require("./OTPModel");
const emailer = require("./emailer");

let timmer = 900000;

router.post("/sendOTP", (req, res) => {
    let emailId = req.body.email;
    
    const user = OTPModel.find({ email: emailId }, function (err, docs) {
        if (err) {
            res.json({
                code: "ER",
                message: "There was an error processing your request",
            });
        } else {
            if (docs[0]) {
                res.json({
                    code: "ER",
                    message: "Email Id already exists kindly choose forgot password",
                });
            } else {
                let otpCodez = Math.floor(100000 + Math.random() * 900000);
                let Time = Date.now();

                const otpM = new OTPModel({
                    email: emailId,
                    otpCode: otpCodez,
                    validity: Time + timmer,
                    createdTime: Time,
                });
                
                otpM
                    .save()
                    .then((data) => {
                        emailer.sendMail(emailId, otpCodez);
                        res.json({ code: "SR", message: "OTP Sent Successfully" });
                    })
                    .catch((err) => {
                        res.json({ code: "ER", message: "Unable to send Email" });
                    });
                
            }
        }
    });
});

router.post("/resendOTP", (req, res) => {
    let otpCodez = Math.floor(100000 + Math.random() * 900000);
    let emailID = req.body.email;
    const otpUp = OTPModel.updateOne(
        { email: emailID },
        { otpCode: otpCodez, validity: Date.now() + timmer },
        function (err, docs) {
            if (err) {
                res.json({
                    code: "ER",
                    message: "Unable to send the email at the moment",
                });
            } else {
                if (docs.modifiedCount > 0) {
                    emailer.sendMail(emailID, otpCodez);
                    res.json({ code: "SR", message: "OTP Sent Successfully" });
                } else {
                    res.json({
                        code: "ER",
                        message: "Unable to send the email at the moment",
                    });
                }
            }
        }
    );
});

router.post("/checkOTP", (req, res) => {
    let emailID = req.body.email;
    let otpNo = req.body.otp;
    let dateNow = Date.now();
    
    const otps = OTPModel.find({ email: emailID }, function (err, docs) {
        if (err) {
        } else {
            if (docs.length !== 0) {
                let val = docs[docs.length - 1].validity - Date.now();
                console.log('docs', docs[docs.length - 1].otpCode)
                console.log('docs', docs)

                if (otpNo == docs[docs.length - 1].otpCode) {
                    if (val < 0) {
                        res.json({
                            code: "ER",
                            message: "Password has expired, Kindly initiate again",
                        });
                    } else {
                        res.json({ code: "SR", message: "Success.." });
                    }
                } else {
                    res.json({ code: "ER", message: "OTP is incorrect" });
                }
            } else {
                res.json({ code: "ER", message: "Kindly initiate OTP again" });
            }
        }
    });
});

module.exports = router;

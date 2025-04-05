const express = require("express");
const { UserModel, TodoModel } = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovecoddingineverytime";
mongoose.connect("mongodb://localhost:27017/learn-database");
app.use(express.json());
const {signUpSchema} = require("./schema");
app.post("/signup", async (req,res) => {
    try {
        const body = req.body;
        const parsedBody = signUpSchema.safeParse({body});
        console.log(parsedBody.error.errors);
        if (!parsedBody.success) {
            res.status(400).json({
            success: false,
            message:
                "Validation error: " +
                parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`),
            });
            return;
        }
        const {email, password, name} = body;
        const response = await UserModel.create({
            email: email,
            password: password,
            name:  name
        })
        console.log(response);
        return res.status(200).json({
            message: "You are logged in"
        })
    } catch (error) {
        console.error(error); // Log the actual error
        return res.status(500).json({
            message: error.message // Show actual validation error
        });
    }
    
});

// app.post("/signin", async (req,res) => {
//     const {email} = req.body;
//     const {password} = req.body;

//     const user = await UserModel.findOne({
//         email: email,
//         password: password
//     });

//     console.log(user);

//     if(user) {
//         const token =jwt.sign({
//             id: user._id
//         }, JWT_SECRET);

//         res.status(200).json({
//             token: token
//         });
//     } else {
//         res.status(403).json({
//             message: "Invalid credentials"
//         })
//     }


// });

app.post("/todo", (req,res) => {

});

app.get("/todos", (req,res) => {

});

app.listen(3000);
const bcrypt = require("bcrypt");
const express = require("express");
require('dotenv').config()

const { UserModel, TodoModel } = require("./db");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovecoddingineverytime";

mongoose.connect(process.env.mongodburi);
const {signUpSchema, signInSchema} = require("./schema");

const app = express();
app.use(express.json());

const {auth } = require("./auth");



app.post("/signup", async (req,res) => {
    try {
        const body = req.body;
        const parsedBody = signUpSchema.safeParse(body);
        if (!parsedBody.success) {
            res.status(400).json({
            success: false,
            message:
                "Validation error: " +
                parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`),
            });
            return;
        }
        const {email, password, name} = parsedBody.data;

        const hashedPassword = await bcrypt.hash(password, 5);

        const response = await UserModel.create({
            email: email,
            password: hashedPassword,
            name:  name
        })
        console.log(response);
        return res.status(200).json({
            message: "You are signed up"
        })
    } catch (error) {
        
        return res.status(500).json({
            message: error.message // Show actual validation error
        });
    }
    
});



app.post("/signin", async (req,res) => {

    try {
    const body = req.body;
    const parsedBody = signInSchema.safeParse(body);

    if (!parsedBody.success) {
        res.status(400).json({
        success: false,
        message:
            "Validation error: " +
            parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`),
        });
        return;
    }
        const {email,password} = parsedBody.data;
        
        const response = await UserModel.findOne({
            email: email,
    });
    if(!response){
        res.status(403).json({
            message: "user not found"
        })
    }
    
    const authenticatedUser = await bcrypt.compare(password,response.password);
    if(!authenticatedUser) {
        return res.status(403).json({
            message: "Passoword does not match"
        })
        } 

        const token =jwt.sign({
            id: response._id
        }, JWT_SECRET);
        res.status(200).json({
            token: token
        });
    } catch (error) {
    return res.status(500).json({
            message: error.message 
        });
    }
});

app.post("/todo", auth, (req,res) => {
    const userId = req.userId;
    const {tittle, description} = req.body;
    TodoModel.create({
        tittle,
        userId,
        description
    })

    res.status(200).json({
        userId: userId
    })
});

app.get("/todos", auth, async (req,res) => {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.status(200).json({
        userId: userId
    }) 
});



app.listen(3000);
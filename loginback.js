const mongoose = require('mongoose');
const { Schema } = mongoose;
const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require('path');

const app = express();
const port = 5000;
const url = 'mongodb://localhost:27017/audiophile';

async function mongoconnect() {
    await mongoose.connect(url);
    console.log("Connected to database");
}
mongoconnect();

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const userdetails = mongoose.model('userdetails', userSchema);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

// Middleware for cookie parsing
app.use(cookieParser());

// Middleware for session handling
app.use(session({
    secret: "your_secret_key", // Change this to a secret key for session encryption
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set secure to true if using HTTPS
        maxAge: 60 * 1000 // 1 minute in milliseconds
    }
}));

// Middleware to check if session is active
const checkLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        // If session exists, redirect or render a page displaying "already logged in"
        return res.send("Already logged in");
    }
    next();
};

// Login route
app.get("/login", checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login2.html'));
});

// Authentication route
app.post("/auth", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userdetails.findOne({ username, password });

        if (user) {
            req.session.user = username; // Store username in session
            return res.redirect("/welcome");
        } else {
            return res.send("Wrong username/password");
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).send("Server issue");
    }
});

// Registration route
app.post("/create", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userdetails.findOne({ username });

        if (existingUser) {
            return res.send("User already exists");
        } else {
            await userdetails.create({ username, password });
            req.session.user = username; // Store username in session
            return res.redirect("/welcome");
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).send("Server issue");
    }
});

// Welcome route
app.get("/welcome", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'loggedin.html'));
});

// Additional routes (home, shop, contact, etc.)
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get("/shop", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'products.html'));
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error destroying session');
        }
        // Redirect to login page or any other appropriate page after logout
        res.redirect('/home');
    });
});






app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'create.html'));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'contact.html'));
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

// app.js (your main server file)

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/foodies", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  allergence: String,
  savedRecipes: [{ id: String, title: String,  }],
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Routes

// Home
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home");
});

// Signup
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/signup", (req, res) => {
  res.redirect("/home1");
});

app.get("/home1", (req, res) => {
  res.render("home1");
});

app.post("/signup", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      allergence: req.body.allergence,
    };

    const existingUser = await User.findOne({ name: data.name });
    if (existingUser) {
      return res.send("User already exists. Please choose a different username.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    await User.create(data);

    req.session.username = data.name;

    res.redirect("/home1");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user. Please try again.");
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const check = await User.findOne({ name: req.body.username });
    if (!check) {
      return res.send("Username not found");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      req.session.username = check.name;
      res.redirect("/home1");
    } else {
      res.send("Wrong password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Profile
app.get("/profile", async (req, res) => {
  try {
    if (!req.session.username) {
      return res.redirect("/login");
    }

    const user = await User.findOne({ name: req.session.username });

    if (!user) {
      return res.send("User not found");
    }

    res.render("profile", { user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Modified /saveRecipe route
app.post("/saveRecipe", async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.username) {
      return res.redirect("/login");
    }

    // Find the user by their username
    const user = await User.findOne({ name: req.session.username });

    if (!user) {
      return res.send("User not found");
    }

    // Extract recipe data from the request body
    const { id,title } = req.body;

    // Add the recipe data to the user's savedRecipes array
    user.savedRecipes.push({
      id,
      title,

    });

    // Save the updated user document
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

app.get("/recipesearchsignin", (req, res) => {
  res.render("recipesearchsignin");
});

app.get("/recipesearchlogin", (req, res) => {
  res.render("recipesearchlogin");
});

app.get("/recipedetailssignin", (req, res) => {
  res.render("recipedetailssignin");
});

app.get("/recipedetailslogin", (req, res) => {
  res.render("recipedetailslogin");
});

// Start the server
const port = 5012;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

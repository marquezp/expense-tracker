require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); // Serve static files from the public directory

// =========== ROUTES ==============

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Sign up
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res
      .status(400)
      .send(
        `<h1>Sign up failed:</h1><p>${error.message}</p><a href="/signup">Try again</a>`
      );
  }

  // Signup success — redirect to dashboard
  res.redirect("/dashboard");
});

// Login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res
      .status(401)
      .send(
        `<h1>Login failed:</h1><p>${error.message}</p><a href="/login">Try again</a>`
      );
  }

  // Login success — redirect to dashboard
  res.redirect("/dashboard");
});

// Dashboard
app.get("/dashboard", async (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Fallback route
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});

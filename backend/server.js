const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: "https://attendance-app-lake.vercel.app" }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://vishveshbece:Vishvesh%402005@cluster0.fwpiw.mongodb.net/attendance?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("Connection error:", error);
});

// Schemas
const userSchema = new mongoose.Schema({
  Name: String,
  college: String,
  id: String,
  mobile: String,
  email: String,
  dailyAttendance: [String], // Ensures it's a string array
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Create New User
app.post('/api/users', async (req, res) => {
  const { Name, college, id, mobile, email } = req.body;
  try {
    const user = new User({ Name, college, id, mobile, email });
    await user.save();
    res.status(200).json({ message: "Member saved" });
  } catch (error) {
    res.status(500).json({ message: 'Server error while saving user' });
  }
});

// Admin Login
app.post('/api/admins', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (password !== admin.password)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  const { email, mobile } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (mobile === user.mobile) {
      res.status(200).json({ message: "Logged in successfully" });
    } else {
      res.status(400).json({ message: "Incorrect mobile number" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during user login' });
  }
});

// Get All Users
app.get('/api/users/get', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

// Update Attendance
app.post('/api/users/update', async (req, res) => {
  const { username, date ,device} = req.body;
  try {
    const user = await User.findOne({ email: username });
    const today = new Date();
    const ld = today.toLocaleDateString();
    console.log(ld);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.dailyAttendance.push(date+"/"+device);
    await user.save();

    res.status(200).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during attendance update' });
  }
});

// Start Server
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

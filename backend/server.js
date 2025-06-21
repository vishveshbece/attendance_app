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
app.get('/api/users/get/id', async (req, res) => {
  const { username, device } = req.query; // use query for GET

  try {
    const user = await User.findOne({ email: username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const users = await User.find();
    // Get today's date string in Asia/Kolkata timezone
    const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Check if user already scanned today or device used today
    let alreadyScanned = false;
    let reason = null;
    for(const user1 of users){
      for (const entry of user1.dailyAttendance) {
      const [dateStr1,datestr2,datastr3, deviceId] = entry.split("/");
      const dateStr = dateStr1+datestr2+datastr3;
      if (deviceId === device) {
        alreadyScanned = true;
        reason = "device"; // same user + device scanned today
        break;
      }
    }
    if(alreadyScanned){
      break;
    }
  }
  for(const entry of user.dailyAttendance){
      const [dateStr1,datestr2,datastr3, deviceId] = entry.split("/");
      const dateStr = dateStr1+datestr2+datastr3;
      if(dateStr == today){
        alreadyScanned = true;
        reason = "user"; // same user + device scanned today
        break;
      }
  }
    return res.status(200).json({ alreadyScanned, reason });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during user check' });
  }
});

app.post('/api/users/update', async (req, res) => {
  const { username, device } = req.body;
  try {
    const user = await User.findOne({ email: username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Avoid double insert
    const alreadyScanned = user.dailyAttendance.some(entry => {
      const [dateStr1,datastr2,dayestr3, deviceId] = entry.split("/");
      const dateStr = dateStr1+datastr2+dayestr3;
      return dateStr === today || deviceId === device;
    });

    if (alreadyScanned) {
      return res.status(400).json({ message: 'Already scanned today or from this device' });
    }

    user.dailyAttendance.push(`${today}/${device}`);
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

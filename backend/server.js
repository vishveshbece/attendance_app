const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  "https://attendance-app-lake.vercel.app",
  "http://localhost:3000" // Add your local development URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB Connection with better options
mongoose.connect(
  "mongodb+srv://vishveshbece:Vishvesh@2005@cluster0.fwpiw.mongodb.net/attendance?retryWrites=true&w=majority",
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
  }
).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("Connection error:", error);
  process.exit(1); // Exit if DB connection fails
});

// Schemas (unchanged)
const userSchema = new mongoose.Schema({
  Name: String,
  college: String,
  id: String,
  mobile: String,
  email: String,
  dailyAttendance: [String],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Enhanced Create New User endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { Name, college, id, mobile, email } = req.body;
    
    // Basic validation
    if (!Name || !college || !id || !mobile || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email or ID already exists" });
    }

    const user = new User({ Name, college, id, mobile, email });
    await user.save();
    res.status(201).json({ message: "Member saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: 'Server error while saving user', error: error.message });
  }
});

// Other endpoints with similar enhanced error handling...

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
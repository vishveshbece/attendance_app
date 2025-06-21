const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment');

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://attendance-app-lake.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// MongoDB Connection - Fixed
const connectDB = async () => {
  try {
    // Properly encode the password (replace @ with %40)
    const password = encodeURIComponent("Vishvesh@2005");
    const connectionString = `mongodb+srv://vishveshbece:${password}@cluster0.fwpiw.mongodb.net/attendance?retryWrites=true&w=majority`;
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Call the connection function
connectDB();

// Schemas
const userSchema = new mongoose.Schema({
  Name: String,
  college: String,
  id: String,
  mobile: String,
  email: String,
  dailyAttendance: [Date], // Changed to store Date objects
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

// ========== API Endpoints ========== //

// 1. User Registration
app.post('/api/users', async (req, res) => {
  try {
    const { Name, college, id, mobile, email } = req.body;
    
    if (!Name || !college || !id || !mobile || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User with this email or ID already exists" 
      });
    }

    const user = new User({ Name, college, id, mobile, email });
    await user.save();
    res.status(201).json({ 
      success: true, 
      message: "Member saved successfully", 
      user 
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving user', 
      error: error.message 
    });
  }
});

// 2. Admin Login
app.post('/api/admins/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    if (password !== admin.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Logged in successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during admin login',
      error: error.message
    });
  }
});

// 3. User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, mobile } = req.body;
    
    if (!email || !mobile) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and mobile are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (mobile !== user.mobile) {
      return res.status(401).json({ 
        success: false, 
        message: "Incorrect mobile number" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Logged in successfully",
      user: {
        _id: user._id,
        Name: user.Name,
        email: user.email,
        id: user.id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during user login',
      error: error.message
    });
  }
});

// 4. Get All Users (for admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { dailyAttendance: 0 }); // Exclude attendance data
    res.status(200).json({ 
      success: true, 
      users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// 5. QR Code Attendance Endpoint
app.post('/api/attendance', async (req, res) => {
  try {
    const { userId, qrData } = req.body;
    
    if (!userId || !qrData) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and QR data are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Validate QR data (add your own validation logic)
    if (!isValidQR(qrData)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid QR code' 
      });
    }

    // Check if already marked attendance today
    const today = moment().startOf('day');
    const hasAttendedToday = user.dailyAttendance.some(date => 
      moment(date).isSameOrAfter(today)
    );

    if (hasAttendedToday) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked today' 
      });
    }

    // Record attendance
    user.dailyAttendance.push(new Date());
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Attendance recorded successfully',
      attendanceDate: new Date()
    });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during attendance recording',
      error: error.message
    });
  }
});

// 6. Get User Attendance
app.get('/api/users/:id/attendance', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { dailyAttendance: 1 });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      attendance: user.dailyAttendance 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching attendance',
      error: error.message
    });
  }
});

// Helper function for QR validation
function isValidQR(qrData) {
  // Implement your QR validation logic here
  // For now, just check if it's not empty
  return qrData && qrData.trim().length > 0;
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
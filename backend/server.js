const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
app.use(cors({origin:"https://attendance-app-lake.vercel.app"}));
app.use(express.json());
mongoose.connect("mongodb+srv://vishveshbece:Vishvesh%402005@cluster0.fwpiw.mongodb.net/attendance?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true },{
    connectTimeoutMS : 10000,
}).then(() =>{
    console.log("MongoDB connected")
}).catch((error)=>{
    console.log("connection error", error)
});
const userSchema = new mongoose.Schema({
    Name: String,
    college: String,
    id: String,
    mobile: String,
    email: String,
    dailyAttendance: [],
});
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
app.post('/api/users', async (req, res) => {
    const { Name, college,id,mobile,email } = req.body;
    try {
        const user = new User({
            Name,
            college,
            id,
            mobile,
            email
        });
        await user.save();
        res.status(200).json({message: "memeber saved"});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/admins', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        const isMatch = password === admin.password;
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        res.status(200).json({message: "loggined successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/users/login', async (req, res) => {
    const { email, mobile } = req.body;
    try {
        const user = await User.findOne({email});
        console.log(user.mobile);
        if(mobile === user.mobile){
        res.status(200).json({message: "loggined successfully"});
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/users/get', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance records' });
    }
});
app.post('/api/users/update',async(req,res)=>{
    const {username,date} = req.body;
    try{
        const user = await User.findOne(username);
        if(!user){
            res.status(400).json({message:'User not found'});
        }
        user.dailyAttendance.push(date);
        await user.save();
        res.status(200).json({message:'succeed successfully'});
    }
    catch (error) {
        res.status(500).json({message:'server error'});
    }
});
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

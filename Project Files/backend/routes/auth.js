const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Assigned = require('../models/Assigned');
const config = require('../config');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, userType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, phone, userType });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, userType: newUser.userType }, 'SECRET_KEY', { expiresIn: '1h' });
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: { id: newUser._id, name: newUser.name, userType: newUser.userType }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, userType: user.userType }, 'SECRET_KEY', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, userType: user.userType } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Get all agents with active assignment counts
router.get('/agents', async (req, res) => {
    try {
        const agents = await User.find({ userType: 'Agent' }).select('-password');
        
        const agentsWithCounts = await Promise.all(agents.map(async (agent) => {
            const assignments = await Assigned.find({ agentId: agent._id }).populate('complaintId');
            // Active assignment: Complaint exists and is not Resolved
            const activeCount = assignments.filter(a => a.complaintId && a.complaintId.status !== 'Resolved').length;
            return { ...agent.toObject(), activeAssignments: activeCount };
        }));
        
        res.json(agentsWithCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

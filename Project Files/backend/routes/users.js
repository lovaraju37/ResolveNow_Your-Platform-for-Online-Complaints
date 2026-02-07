const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Get Current User Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Current User Profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        // Build update object with only allowed fields
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        
        // Note: userType is intentionally excluded to prevent updates
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Users (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is Admin
        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

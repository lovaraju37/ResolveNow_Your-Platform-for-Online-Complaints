const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');

// Send Message
router.post('/', async (req, res) => {
    try {
        const { complaintId, name, message } = req.body;
        const newMessage = new Message({ complaintId, name, message });
        const savedMessage = await newMessage.save();

        // Emit socket event
        const io = req.app.get('io');
        io.emit('newMessage', savedMessage);

        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Messages for a Complaint
router.get('/:complaintId', auth, async (req, res) => {
    try {
        const messages = await Message.find({ complaintId: req.params.complaintId }).sort({ sentAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark messages as read
router.put('/read/:complaintId', auth, async (req, res) => {
    try {
        const { complaintId } = req.params;
        const userName = req.user.name;

        // Update all messages in this complaint that were NOT sent by the current user
        await Message.updateMany(
            { complaintId, name: { $ne: userName }, read: false },
            { $set: { read: true } }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get unread counts
router.get('/unread/counts', auth, async (req, res) => {
    try {
        const userName = req.user.name;
        // Find all unread messages not sent by the current user
        const unreadMessages = await Message.aggregate([
            { $match: { name: { $ne: userName }, read: false } },
            { $group: { _id: '$complaintId', count: { $sum: 1 } } }
        ]);

        const counts = {};
        unreadMessages.forEach(item => {
            counts[item._id] = item.count;
        });

        res.json(counts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

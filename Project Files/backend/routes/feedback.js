const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/authMiddleware');
const Assigned = require('../models/Assigned');

// Create Feedback
router.post('/', auth, async (req, res) => {
    try {
        const { complaintId, rating, comment } = req.body;
        const userId = req.user.id;

        // Find the agent assigned to this complaint
        const assignment = await Assigned.findOne({ complaintId });
        const agentId = assignment ? assignment.agentId : null;

        const newFeedback = new Feedback({
            userId,
            complaintId,
            agentId,
            rating,
            comment
        });

        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Feedback for a specific complaint
router.get('/complaint/:complaintId', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ complaintId: req.params.complaintId });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Feedback for an agent
router.get('/agent/:agentId', auth, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ agentId: req.params.agentId }).populate('userId', 'name');
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

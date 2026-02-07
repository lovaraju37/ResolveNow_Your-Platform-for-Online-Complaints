const express = require('express');
const router = express.Router();
const Assigned = require('../models/Assigned');
const auth = require('../middleware/authMiddleware');

const Complaint = require('../models/Complaint');

// Assign Agent to Complaint
router.post('/', auth, async (req, res) => {
    try {
        const { complaintId, agentId, agentName } = req.body;

        // Check if complaint is already assigned
        const existingAssignment = await Assigned.findOne({ complaintId });
        if (existingAssignment) {
            return res.status(400).json({ error: 'Complaint is already assigned to an agent' });
        }

        // Check agent's current active assignments limit
        const agentAssignments = await Assigned.find({ agentId }).populate('complaintId');
        const activeAgentCount = agentAssignments.filter(a => a.complaintId && a.complaintId.status !== 'Resolved').length;
        
        if (activeAgentCount >= 3) {
            return res.status(400).json({ error: 'Agent has reached maximum limit of 3 active assignments' });
        }

        const newAssignment = new Assigned({ complaintId, agentId, agentName });
        const savedAssignment = await newAssignment.save();

        // Update Complaint status to 'Assigned'
        await Complaint.findByIdAndUpdate(complaintId, { status: 'Assigned' });

        res.status(201).json(savedAssignment);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Complaint is already assigned to an agent' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Get Assignments by Agent ID
router.get('/agent/:agentId', auth, async (req, res) => {
    try {
        const assignments = await Assigned.find({ agentId: req.params.agentId })
            .populate({
                path: 'complaintId',
                populate: { path: 'userId', select: 'name email' }
            });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Assignments (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const assignments = await Assigned.find().populate('complaintId agentId');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

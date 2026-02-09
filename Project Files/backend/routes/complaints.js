const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images and documents are allowed!'));
    }
});

// Create Complaint
router.post('/', auth, upload.array('attachments', 10), async (req, res) => {
    try {
        const complaintData = req.body;
        
        // Process attachments
        if (req.files && req.files.length > 0) {
            const attachmentNames = req.body.attachmentNames || [];
            // Ensure attachmentNames is an array even if single string
            const namesList = Array.isArray(attachmentNames) ? attachmentNames : [attachmentNames];
            
            complaintData.attachments = req.files.map((file, index) => ({
                path: file.path,
                originalName: file.originalname,
                name: namesList[index] || file.originalname // Use provided name or fallback to original
            }));
        } else {
            complaintData.attachments = [];
        }

        const newComplaint = new Complaint(complaintData);
        const savedComplaint = await newComplaint.save();
        
        // Emit event
        const io = req.app.get('io');
        io.emit('complaintCreated', savedComplaint);

        res.status(201).json(savedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Complaints
router.get('/', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('userId', 'name email');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Complaint
router.get('/:id', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Complaint
router.put('/:id', async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedComplaint) return res.status(404).json({ error: 'Complaint not found' });

        // Emit event
        const io = req.app.get('io');
        io.emit('complaintUpdated', updatedComplaint);

        res.json(updatedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Complaint
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!deletedComplaint) return res.status(404).json({ error: 'Complaint not found' });

        // Emit event
        const io = req.app.get('io');
        io.emit('complaintDeleted', req.params.id);

        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    name: { type: String, required: true }, // Sender Name
    message: { type: String, required: true },
    attachments: [{
        path: { type: String, required: true },
        name: { type: String },
        originalName: { type: String }
    }],
    read: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);

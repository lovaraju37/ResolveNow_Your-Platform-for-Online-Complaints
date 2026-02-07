const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    name: { type: String, required: true }, // Sender Name
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now }
}, { collection: 'message' });

module.exports = mongoose.model('Message', MessageSchema);

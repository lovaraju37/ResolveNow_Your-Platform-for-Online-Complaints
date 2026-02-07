const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, as some might not be assigned? But usually resolved ones are.
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'feedback' });

module.exports = mongoose.model('Feedback', FeedbackSchema);

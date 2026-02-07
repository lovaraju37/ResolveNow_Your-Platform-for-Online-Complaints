const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    comment: { type: String, required: true },
    attachment: { type: String }, // Path to the uploaded file
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'complaint_schema' });

module.exports = mongoose.model('Complaint', ComplaintSchema);

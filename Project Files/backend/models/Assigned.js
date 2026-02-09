const mongoose = require('mongoose');

const AssignedSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true, unique: true },
    agentName: { type: String, required: true },
    status: { type: String, default: 'Assigned' },
    assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assigned', AssignedSchema);

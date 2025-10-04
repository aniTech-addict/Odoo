import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
    expense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        required: [true, 'Expense reference is required']
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Requesting user is required']
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Approver is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    comments: {
        type: String,
        trim: true
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // For delegation - when someone else reviews on behalf of the approver
    delegatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    delegationReason: {
        type: String,
        trim: true
    },
    // For escalation
    escalatedAt: {
        type: Date
    },
    escalatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    escalationReason: {
        type: String,
        trim: true
    },
    // Due date for approval
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    // Reminder settings
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderSentAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better query performance
approvalSchema.index({ approver: 1, status: 1 });
approvalSchema.index({ expense: 1 });
approvalSchema.index({ status: 1 });
approvalSchema.index({ dueDate: 1 });
approvalSchema.index({ priority: 1 });

// Method to approve the request
approvalSchema.methods.approve = function(comments) {
    this.status = 'Approved';
    this.reviewedAt = new Date();
    this.reviewedBy = this.approver;
    if (comments) {
        this.comments = comments;
    }
    return this.save();
};

// Method to reject the request
approvalSchema.methods.reject = function(comments) {
    this.status = 'Rejected';
    this.reviewedAt = new Date();
    this.reviewedBy = this.approver;
    if (comments) {
        this.comments = comments;
    }
    return this.save();
};

// Method to delegate to another user
approvalSchema.methods.delegate = function(delegateToUserId, reason) {
    this.delegatedTo = delegateToUserId;
    this.delegationReason = reason;
    return this.save();
};

// Method to escalate
approvalSchema.methods.escalate = function(escalatedByUserId, reason) {
    this.escalatedAt = new Date();
    this.escalatedBy = escalatedByUserId;
    this.escalationReason = reason;
    return this.save();
};

// Static method to find pending approvals for a user
approvalSchema.statics.findPendingForUser = function(userId) {
    return this.find({
        approver: userId,
        status: 'Pending'
    }).populate('expense requestedBy');
};

// Static method to find overdue approvals
approvalSchema.statics.findOverdue = function() {
    return this.find({
        status: 'Pending',
        dueDate: { $lt: new Date() }
    }).populate('expense requestedBy approver');
};

const Approval = mongoose.model('Approval', approvalSchema);

export default Approval;
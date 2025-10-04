import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Expense subject is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        uppercase: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Expense owner is required']
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Approved', 'Rejected', 'Paid'],
        default: 'Draft'
    },
    receipt: {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        trim: true
    }],
    // For recurring expenses
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
        required: function() {
            return this.isRecurring;
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
expenseSchema.index({ owner: 1, status: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ submittedAt: -1 });
expenseSchema.index({ amount: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
    return `${this.amount.toFixed(2)} ${this.currency}`;
});

// Method to submit expense for approval
expenseSchema.methods.submitForApproval = function() {
    this.status = 'Submitted';
    this.submittedAt = new Date();
    return this.save();
};

// Method to approve expense
expenseSchema.methods.approve = function(approvedByUserId, comments) {
    this.status = 'Approved';
    this.approvedBy = approvedByUserId;
    this.approvedAt = new Date();
    if (comments) {
        this.approvalComments = comments;
    }
    return this.save();
};

// Method to reject expense
expenseSchema.methods.reject = function(rejectionReason) {
    this.status = 'Rejected';
    this.rejectionReason = rejectionReason;
    return this.save();
};

// Ensure virtual fields are serialized
expenseSchema.set('toJSON', { virtuals: true });
expenseSchema.set('toObject', { virtuals: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
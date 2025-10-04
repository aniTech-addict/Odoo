// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true // Removes whitespace from both ends
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Always store email in lowercase
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6 // Enforce a minimum password length
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'editor'], // Defines possible roles
        default: 'user' // Sets a default role for new users
    }
}, {
    // This option adds `createdAt` and `updatedAt` fields automatically
    timestamps: true 
});

// Mongoose Middleware: This function runs *before* a user document is saved
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with a salt round of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance Method: To compare candidate password with the hashed password in DB
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
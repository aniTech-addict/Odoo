// controllers/authController.js

import User from '../db/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto'; // Built-in Node.js module for crypto operations
import jwt from 'jsonwebtoken';

// --- HELPER FUNCTIONS ---

// 1. Function to generate a random password
function generateRandomPassword() {
    // Creates a cryptographically secure random string
    return crypto.randomBytes(8).toString('hex'); 
}

// 2. Function to configure and send email
async function sendPasswordByEmail(email, password) {
    // You need to set up an email transporter. 
    // For Gmail, you might need to use an "App Password".
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Account Details',
        html: `
            <h1>Welcome!</h1>
            <p>Your account has been created successfully.</p>
            <p>Your temporary password is: <strong>${password}</strong></p>
            <p>Please log in and change your password immediately.</p>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password email sent to ${email}`);
}

// 3. Function to generate JWT token
function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
}

// 4. Function to verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
        return null;
    }
}


// --- CONTROLLER FOR CREATING A NEW USER ---

export const createUser = async (req, res) => {
    const { username, email, role } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        // Step 1: Generate the random password
        const randomPassword = generateRandomPassword();

        // Step 2: Create a new user instance
        const newUser = new User({
            username,
            email,
            password: randomPassword, // Pass the plain password here. Hashing happens on save.
            role 
        });

        // Step 3: Save the user to the database
        // The `pre-save` hook in the model will automatically hash the password.
        await newUser.save();

        // Step 4: Email the *original* random password to the user
        await sendPasswordByEmail(email, randomPassword);

        // Don't send the password back in the response!
        res.status(201).json({ 
            message: 'User created successfully! A temporary password has been sent to the email.',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        // Handle potential errors, like a duplicate email or username
        if (error.code === 11000) {
             return res.status(409).json({ message: 'Error: Email or username already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};


// --- CONTROLLER FOR USER LOGIN ---

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check if password is correct
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


// --- CONTROLLER FOR PASSWORD RESET REQUEST ---

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save reset token to user (in production, use a separate collection)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Server error during password reset request.' });
    }
};


// --- CONTROLLER FOR PASSWORD RESET ---

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // Set new password (pre-save hook will hash it)
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful!' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};


// --- CONTROLLER FOR GETTING USER PROFILE ---

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile.' });
    }
};


// --- CONTROLLER FOR UPDATING USER PROFILE ---

export const updateProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists.' });
            }
            user.email = email.toLowerCase();
        }

        if (username) {
            user.username = username;
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};


// --- HELPER FUNCTION FOR PASSWORD RESET EMAIL ---

async function sendPasswordResetEmail(email, resetToken) {
    let transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    let mailOptions = {
        from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset for your account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
}
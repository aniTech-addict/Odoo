import User from '../db/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

// Get all users (admin only)
export const getUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            role,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await User.countDocuments(filter);

        res.status(200).json({
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
};

// Get user by ID (admin or self)
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if user is requesting their own profile or is admin
        if (user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
};

// Update user (admin or self)
export const updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check permissions
        const isSelf = user._id.toString() === req.user.userId;
        const isAdmin = req.user.role === 'admin';

        if (!isSelf && !isAdmin) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Only admin can update roles
        if (role && !isAdmin) {
            return res.status(403).json({ message: 'Only admins can update user roles.' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists.' });
            }
            user.email = email.toLowerCase();
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            user.username = username;
        }

        if (role && isAdmin) {
            user.role = role;
        }

        await user.save();

        res.status(200).json({
            message: 'User updated successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account.' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'User deleted successfully!' });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};

// Change password (self or admin)
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check permissions
        const isSelf = user._id.toString() === req.user.userId;
        const isAdmin = req.user.role === 'admin';

        if (!isSelf && !isAdmin) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // If not self (admin changing password), don't require current password
        if (isSelf) {
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ message: 'Current password is incorrect.' });
            }
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully!' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
};

// Get user statistics (admin only)
export const getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    roleBreakdown: { $push: '$role' },
                    recentUsers: {
                        $push: {
                            _id: '$_id',
                            username: '$username',
                            email: '$email',
                            role: '$role',
                            createdAt: '$createdAt'
                        }
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(200).json({
                totalUsers: 0,
                roleBreakdown: {},
                recentUsers: []
            });
        }

        // Calculate role counts
        const roleBreakdown = stats[0].roleBreakdown.reduce((acc, role) => {
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        // Get recent users (last 10)
        const recentUsers = stats[0].recentUsers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

        res.status(200).json({
            totalUsers: stats[0].totalUsers,
            roleBreakdown,
            recentUsers
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ message: 'Server error while fetching user statistics.' });
    }
};
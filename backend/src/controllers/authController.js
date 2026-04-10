const User = require('../models/User');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Sign up a new user
 * POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, role, fullName, phoneNumber, nic: ownerNic, address, occupation,
            firstName, lastName, studentId, nic, birthday, academicYear } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Validate email format based on role
    if (role === 'student') {
      if (!email.endsWith('@sliit.lk') && !email.endsWith('@my.sliit.lk')) {
        return res.status(400).json({
          success: false,
          message: 'Students must use @sliit.lk or @my.sliit.lk email',
        });
      }
    } else if (role === 'owner') {
      if (email.endsWith('@sliit.lk') || email.endsWith('@my.sliit.lk')) {
        return res.status(400).json({
          success: false,
          message: 'Property owners must use a business or personal email',
        });
      }
      
      // Validate owner-specific required fields
      if (!fullName || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Full name and phone number are required for property owners',
        });
      }
      if (!ownerNic) {
        return res.status(400).json({ success: false, message: 'NIC is required for property owners' });
      }
      if (!address) {
        return res.status(400).json({ success: false, message: 'Address is required for property owners' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Owners are auto-verified; students must confirm email
    const isOwner = role === 'owner';

    const userData = {
      email,
      password,
      role: role || 'student',
      isVerified: isOwner,
    };

    // Add owner-specific fields
    if (isOwner) {
      userData.fullName = fullName;
      userData.phoneNumber = phoneNumber;
      userData.nic = ownerNic || '';
      userData.address = address || '';
      userData.occupation = occupation || '';
    }

    // Add student-specific fields
    if (role === 'student') {
      userData.firstName = firstName || '';
      userData.lastName = lastName || '';
      userData.studentId = studentId || '';
      userData.nic = nic || '';
      userData.birthday = birthday || '';
      userData.academicYear = academicYear || '';
    }

    const user = new User(userData);

    if (!isOwner) {
      // Students: generate email verification token and send
      const verificationToken = user.generateVerificationToken();
      await user.save();
      try {
        await sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }
      return res.status(201).json({
        success: true,
        message: 'Account created. Please verify your email.',
        data: { userId: user._id, email: user.email, role: user.role, isVerified: false },
      });
    }

    // Owners: save and return a JWT so they can immediately upload KYC
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        isVerified: true,
        token,
        user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: error.message,
    });
  }
};

/**
 * Verify email with token
 * GET /api/auth/verify-email?token=xxx
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Hash the token to match stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and check expiry
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(
        user.email,
        user.role === 'owner' ? user.fullName : user.email.split('@')[0]
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if welcome email fails
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now sign in.',
      data: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
};

/**
 * Sign in user
 * POST /api/auth/signin
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before signing in',
        needsVerification: true,
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Record login activity (keep last 20)
    const now = new Date();
    await User.findByIdAndUpdate(user._id, {
      lastLogin: now,
      $push: { loginHistory: { $each: [{ loginAt: now }], $slice: -20 } },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sign in',
      error: error.message,
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, a reset email has been sent.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailErr) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
    }

    res.status(200).json({ success: true, message: 'If an account exists, a reset email has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: Date.now() },
    }).select('+password +passwordResetToken +passwordResetTokenExpiry');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'mobileNumber', 'age', 'bio', 'profilePicture', 'profilePictures',
      'minBudget', 'maxBudget', 'distance', 'selectedLocation', 'gender',
      'academicYear', 'roommatePreference', 'roomType', 'lifestylePrefs',
      'firstName', 'lastName', 'phoneNumber', 'address', 'occupation',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

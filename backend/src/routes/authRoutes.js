const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

const validateRequest = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/auth');

const signupValidation = [
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	body('role').optional().isIn(['student', 'owner']).withMessage('Role must be student or owner'),
	body('fullName').optional().trim(),
	body('phoneNumber').optional().trim(),
	body('companyName').optional().trim(),
	body('propertyCount').optional().isInt({ min: 0 }).withMessage('Property count must be 0 or greater'),
];

const verifyEmailValidation = [
	query('token').isString().notEmpty().withMessage('Verification token is required'),
];

const resendValidation = [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()];
const signinValidation = [
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('password').notEmpty().withMessage('Password is required'),
];

const profileUpdateValidation = [
	body('fullName').optional().isString().trim(),
	body('mobileNumber').optional().isString().trim(),
	body('age').optional().isNumeric().withMessage('Age must be a number'),
	body('bio').optional().isString().isLength({ max: 180 }).withMessage('Bio must be 180 characters or less'),
	body('profilePicture').optional().isString(),
	body('profilePictures').optional().isArray().withMessage('Profile pictures must be an array'),
	body('minBudget').optional().isNumeric().withMessage('Minimum budget must be a number'),
	body('maxBudget').optional().isNumeric().withMessage('Maximum budget must be a number'),
	body('distance').optional().isNumeric().withMessage('Distance must be a number'),
	body('selectedLocation').optional().isString(),
	body('gender').optional().isString(),
	body('academicYear').optional().isString(),
	body('roommatePreference').optional().isString(),
	body('roomType').optional().isString(),
	body('lifestylePrefs').optional().isArray().withMessage('Lifestyle preferences must be an array'),
];


/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (student or owner)
 * @access  Public
 */
router.post('/signup', signupValidation, validateRequest, authController.signup);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify user email with token
 * @access  Public
 */
router.get('/verify-email', verifyEmailValidation, validateRequest, authController.verifyEmail);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify user email with token path param
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', resendValidation, validateRequest, authController.resendVerification);

/**
 * @route   POST /api/auth/signin
 * @desc    Sign in user
 * @access  Public
 */

router.post('/signin', signinValidation, validateRequest, authController.signin);

router.put('/profile', requireAuth, profileUpdateValidation, validateRequest, authController.updateProfile);

router.get('/me', requireAuth, authController.getMe);


router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

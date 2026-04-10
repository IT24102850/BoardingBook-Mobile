const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const kycUpload = require('../middleware/kycUpload');
const kycController = require('../controllers/kycController');

// GET /api/kyc/status — owner checks their KYC status
router.get('/status', userAuth, kycController.getKycStatus);

// POST /api/kyc/submit — owner uploads documents
router.post('/submit', userAuth, kycUpload, kycController.submitKyc);

module.exports = router;

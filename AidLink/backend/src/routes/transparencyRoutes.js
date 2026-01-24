const { Router } = require('express');
const transparencyController = require('../controllers/transparencyController');

const router = Router();

router.get('/ledger', transparencyController.getLedger);
router.get('/stats', transparencyController.getStats);

module.exports = router;



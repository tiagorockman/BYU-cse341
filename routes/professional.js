const express = require('express');
const router = express.Router();

const professionalController = require('../controllers/professional');

router.get('/', professionalController.getData);
router.post('/', professionalController.createProfessional);
router.put('/', professionalController.updateProfessional);
router.delete('/', professionalController.deleteProfessional);

module.exports = router;
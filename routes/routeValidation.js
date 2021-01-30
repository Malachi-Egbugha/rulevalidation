const express = require('express');
const router = express.Router();

const { validateBody, schemas, fieldValidation } = require('../middleware/validator');
const { read, validateRule } = require('../controllers/routeValidation');

// Routes
router.route('/').get(read);
router.route('/validate-rule')
    .post(validateBody(schemas.authSchema), fieldValidation, validateRule)

module.exports = router;
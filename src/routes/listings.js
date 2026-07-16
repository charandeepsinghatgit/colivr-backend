const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
    createListing,
    getAllListings,
    getOneListing,
    updateListing,
    deleteListing
} = require('../controllers/listingsController');

router.get('/', getAllListings);
router.get('/:id', getOneListing);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
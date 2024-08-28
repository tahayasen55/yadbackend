const express = require('express');
const mongoose = require('mongoose');
const Supplication = require('../model/supplication');

const router = express.Router();

// Secret key (you can store this securely in environment variables in a real application)
const SECRET_KEY = '7C5998BF8B73941F5DD9E32E1F75B';

// Middleware to check secret key
const checkSecretKey = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];
  if (!secretKey || secretKey !== SECRET_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid or missing secret key' });
  }
  next();
};

// Create a new supplication (only with valid secret key)
router.post('/add', checkSecretKey, async (req, res) => {
  const { text, type, description } = req.body;

  if (!text || !type) {
    return res.status(400).json({ message: 'Text and type are required fields' });
  }

  try {
    const newSupplication = new Supplication({
      text,
      type,
      description
    });

    const savedSupplication = await newSupplication.save();
    res.status(201).json({ message: 'Supplication added successfully', supplication: savedSupplication });
  } catch (error) {
    console.error('Error adding supplication:', error);
    res.status(500).json({ message: 'Error adding supplication', error });
  }
});

// Update a supplication by ID (only with valid secret key)
router.put('/:id', checkSecretKey, async (req, res) => {
  const { text, type, description } = req.body;

  if (!text || !type) {
    return res.status(400).json({ message: 'Text and type are required fields' });
  }

  try {
    const updatedSupplication = await Supplication.findByIdAndUpdate(
      req.params.id,
      { text, type, description },
      { new: true, runValidators: true }
    );

    if (!updatedSupplication) {
      return res.status(404).json({ message: 'Supplication not found' });
    }

    res.status(200).json({ message: 'Supplication updated successfully', supplication: updatedSupplication });
  } catch (error) {
    console.error('Error updating supplication:', error);
    res.status(500).json({ message: 'Error updating supplication', error });
  }
});

// Delete a supplication by ID (only with valid secret key)
router.delete('/:id', checkSecretKey, async (req, res) => {
  try {
    const deletedSupplication = await Supplication.findByIdAndDelete(req.params.id);
    if (!deletedSupplication) {
      return res.status(404).json({ message: 'Supplication not found' });
    }
    res.status(200).json({ message: 'Supplication deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplication:', error);
    res.status(500).json({ message: 'Error deleting supplication', error });
  }
});

// Other routes (e.g., GET) do not require the secret key
router.get('/', async (req, res) => {
  try {
    const supplications = await Supplication.find();
    res.status(200).json(supplications);
  } catch (error) {
    console.error('Error fetching supplications:', error);
    res.status(500).json({ message: 'Error fetching supplications', error });
  }
});

router.get('/random', async (req, res) => {
  try {
    const count = await Supplication.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No supplications found' });
    }
    const random = Math.floor(Math.random() * count);
    const randomSupplication = await Supplication.findOne().skip(random);
    res.status(200).json(randomSupplication);
  } catch (error) {
    console.error('Error fetching random supplication:', error);
    res.status(500).json({ message: 'Error fetching random supplication', error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid supplication ID format' });
  }

  try {
    const supplication = await Supplication.findById(id);
    if (!supplication) {
      return res.status(404).json({ message: 'Supplication not found' });
    }
    res.status(200).json(supplication);
  } catch (error) {
    console.error('Error fetching supplication:', error);
    res.status(500).json({ message: 'Error fetching supplication', error });
  }
});

module.exports = router;

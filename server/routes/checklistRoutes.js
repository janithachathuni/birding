// routes/checklistRoutes.js
const express = require('express');
const {
    createChecklist,
    getAllChecklists,
    getChecklistsByTrip,
    getChecklistById,
    addObservation,
    updateObservation,
    deleteObservation,
    addNote,
    updateNote,
    deleteNote,
    updateChecklist,
    deleteChecklist
} = require('../controllers/checklistController');

const router = express.Router();

// Checklist CRUD Routes
router.post('/create', createChecklist);
router.get('/user/:userId', getAllChecklists);
router.get('/trip/:tripId', getChecklistsByTrip);
router.get('/:checklistId', getChecklistById);
router.put('/:checklistId', updateChecklist);
router.delete('/:checklistId', deleteChecklist);

// Observation Routes
router.post('/:checklistId/observations', addObservation);
router.put('/:checklistId/observations/:observationId', updateObservation);
router.delete('/:checklistId/observations/:observationId', deleteObservation);

// Note Routes
router.post('/:checklistId/notes', addNote);
router.put('/:checklistId/notes/:noteId', updateNote);
router.delete('/:checklistId/notes/:noteId', deleteNote);

module.exports = router;
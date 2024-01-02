const express = require('express') 
const router = express.Router()
const notesController = require('../controllers/notesController')

router.route('/')
    .get(notesController.getAllNotes)
    .get(notesController.createNewNote)
    .get(notesController.updateNote)
    .get(notesController.deleteNote)

module.exports = router
import { Router } from 'express';
import { getAllNotesOfUser, createNewNote, getSpecificNote, updateSpecificNote, deleteSpecificNote} from './notes.service.js';
import { Authentication } from '../User/user.service.js';





const router = Router();



router.route("/")
    .get(Authentication, getAllNotesOfUser)
    .post(Authentication, createNewNote);



router.route("/:id")
    .get(Authentication, getSpecificNote)
    .put(Authentication, updateSpecificNote)
    .delete(Authentication, deleteSpecificNote);



export default router;
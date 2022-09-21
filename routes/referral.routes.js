import express from 'express'
import { getReferrals, createReferrals,updateReferral, deleteReferral, updateNote, createNote, deleteNote, getSingleReferral } from "../controllers/referral.controller.js"
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router()

router.get("/getreferrals",protect, getReferrals)

router.post("/createreferral",protect, createReferrals)

router.put("/updatereferral/:id",protect, updateReferral)

router.delete("/deletereferral/:id",protect, deleteReferral)

router.get("/getsinglereferral/:id", protect, getSingleReferral)

// NOTE CRUD 
router.post("/createnote/:id",protect, createNote)

// router.put("/updatenote/:referral_id/note/:note_id",protect, updateNote)

router.delete("/deletenote/:referralId/note/:noteId",protect, deleteNote)


export default router
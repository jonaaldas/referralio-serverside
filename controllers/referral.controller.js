/* eslint-disable max-len */
// eslint-disable-next-line import/extensions
import ReferralsSchema from '../models/referral.js';
// date function
const dateTime = () => {
  const currentdate = new Date();
  return `${currentdate.getMonth() + 1
  }/${currentdate.getDate()

  }/${
    currentdate.getFullYear()
  } @ ${
    currentdate.getHours()
  }:${
    currentdate.getMinutes()
  }:${
    currentdate.getSeconds()}`;
};

// @desc Get Goals
// @route Get/api/getreferrals
// @access Private
export const getReferrals = async (req, res) => {
  const referrals = await ReferralsSchema.find({ user: req.user.id });
  res.status(200).json(referrals);
};

// @desc Create Referral
// @route Post/api/createreferrals
// @access Private
export const createReferrals = async (req, res) => {
  dateTime();
  try {
    const {
      referralType,
      clientsName,
      typeOfTransaction,
      clientsPhoneNumber,
      clientsEmail,
      closed,
      realtorsName,
      realtorsEmail,
      realtorsPhone,
      PropertyType,
      BedsandBaths,
      note,
      Financing,
      LendersName,
      LendersPhoneNumber,
      LendersEmail,
      referredDate,
    } = req.body;
    const referral = new ReferralsSchema({
      user: req.user.id,
      referralType,
      clientsName,
      typeOfTransaction,
      clientsPhoneNumber,
      clientsEmail,
      closed,
      realtorsName,
      realtorsEmail,
      realtorsPhone,
      referredDate,
    });
    referral.referredDate = dateTime();
    referral.ClientDetails = {
      PropertyType: PropertyType || '',
      BedsandBaths: BedsandBaths || '',
    };
    referral.FinancingDetails = {
      Financing: Financing || '',
      LendersName: LendersName || '',
      LendersPhoneNumber: LendersPhoneNumber || '',
      LendersEmail: LendersEmail || '',
    };
    referral.agentNotes.push({
      note,
      dateAdded: dateTime(),
    });
    await referral.save();
    return res.status(200).json(referral);
  } catch (error) {
    return error;
  }
};

// @desc Update Referral
// @route Put/api/updatereferral/:id
// @access Private
export const updateReferral = async (req, res) => {
  try {
    const refferalToUpdate = await ReferralsSchema.findById(req.params.id);

    if (!refferalToUpdate) {
      res.status(400);
      throw new Error('refferal Note found');
    }

    // check for user
    if (!req.user) {
      res.data(401);
      throw new Error('User not Found');
    }

    // make sure the log in user mathces the goal user
    if (refferalToUpdate.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedReferral = await ReferralsSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json(updatedReferral);
  } catch (error) {
    return error;
  }
};

// @desc Get Single Referral
// @route GET/api/getsinglereferral/:id
// @access Private
export const getSingleReferral = async (req, res) => {
  try {
    // check for user
    if (!req.user) {
      res.data(401);
      throw new Error('User not Found');
    }

    const singleReferral = await ReferralsSchema.findById(req.params.id);
    if (singleReferral === null) {
      return res.status(400).json('refferal Note found');
    }
    return res.status(200).json(singleReferral);
  } catch (error) {
    return error;
  }
};

// @desc Delete Referral
// @route delete/api/deletereferral/:id
// @access Private
export const deleteReferral = async (req, res) => {
  try {
    const refferalToDelete = await ReferralsSchema.findById(req.params.id);

    if (!refferalToDelete) {
      res.status(400);
      throw new Error('refferal Not Found');
    }
    // check for user
    if (!req.user) {
      res.data(401);
      throw new Error('User not Found');
    }

    // make sure the log in user mathces the goal user
    if (refferalToDelete.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    // console.log(refferalToDelete.user, req.user)
    await refferalToDelete.remove();

    const refferralToBeDelted = await ReferralsSchema.findByIdAndDelete(req.params.id);

    return res.status(200).json(refferralToBeDelted);
  } catch (error) {
    return error;
  }
};

// notes CRUD API

// @desc  POST referral Notes
// @route POST/api/createNote/:referralId
// @access Private

export const createNote = async (req, res) => {
  try {
    const referralToAddNote = await ReferralsSchema.findById(req.params.id);
    if (referralToAddNote.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    const referralWithNewNote = await ReferralsSchema.findByIdAndUpdate({ _id: req.params.id }, {
      $push: {
        agentNotes: req.body,
      },
    });
    await referralWithNewNote.save();
    return res.status(200).json(referralWithNewNote);
  } catch (error) {
    return error;
  }
};

// @desc PUT update note
// @route PUT/api/updatenote/:referralId/note/:noteId
// @access Private

export const updateNote = async (req, res) => {
  const { referralId, noteId } = req.params;
  try {
    const referralToUpdateNote = await ReferralsSchema.findById(referralId);
    if (referralToUpdateNote.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    const updatedNote = await ReferralsSchema.updateOne({
      agentNotes: { $elemMatch: { _id: noteId } },
    }, { $set: { 'agentNotes.$.note': req.body.note } });
    return res.status(200).json(updatedNote);
  } catch (error) {
    return error;
  }
};

// remove
// @desc Delete delete note
// @route Delete/api/deletenote/:referralId/note/:noteId
// @access Private

export const deleteNote = async (req, res) => {
  try {
    const { referralId, noteId } = req.params;

    const referralToDelete = await ReferralsSchema.findById(referralId);

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (referralToDelete.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const deletedNote = await ReferralsSchema.updateMany({ _id: referralId }, { $pull: { agentNotes: { _id: noteId } } });
    return res.status(200).json(deletedNote);
  } catch (error) {
    return error;
  }
};

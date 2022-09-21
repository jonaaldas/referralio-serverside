import mongoose from 'mongoose'

const referralMongoose = mongoose.Schema({
  user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'userShema',
	},
	referralType: {type: String, required: true},
	clientsName: {type: String, required: true},
	typeOfTransaction: {type: String, required: true},
	clientsPhoneNumber: {type: Number, required: true},
	clientsEmail: {type: String, required: true},
	closed: {type: Boolean, default: false},
	referredDate: { type: String},
	realtorsName: {type: String, required: true},
	realtorsEmail: {type: String, required: true},
	realtorsPhone: {type: String, required: true},
	ClientDetails: {
		PropertyType: {type: String},
		BedsandBaths: {type: String},
	},
	FinancingDetails: {
		Financing: {type: String},
		LendersName: {type: String},
		LendersPhoneNumber: {type: String},
		LendersEmail: {type: String},
	},
	agentNotes: [
		{
			note: {type: String},
			dateAdded: { type: String },
		},
	]
}, {
  timestamps: true
})


export default mongoose.model('referralSchema', referralMongoose)
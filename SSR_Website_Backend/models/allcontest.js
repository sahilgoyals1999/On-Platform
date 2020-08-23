const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allContestSchema = new Schema({
	questions: [
		{
			questionId: {
				type: Schema.Types.ObjectId,
				ref: 'Question',
				required: true
			}
		}
	],
	admin: {
		name: {
			type: String,
			required: true
		},
		adminId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Admin'
		}
	},
	contestName: {
		type: String,
		required: true
	},
	participant: {
		users: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true
				},
				questions: [
					{
						questionId: {
							type: Schema.Types.ObjectId,
							ref: 'Question',
							required: true
						},
						score: {
							type: Number,
							required: true
						}
					}
				],
				totalScore: {
					type: Number,
					required: true
				}
			}
		]
	}
});

module.exports = mongoose.model('AllContest', allContestSchema);
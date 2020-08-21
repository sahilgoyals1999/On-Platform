const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
	 	const error = new Error('Validation faild.');
	 	error.statusCode = 422;
	 	error.data = error.array();
	 	throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	const totalQuestions = 0;
	bcrypt.hash(password, 12)
		.then(hashedPw => {
			const admin = new Admin({
				email: email,
				name: name,
				password: hashedPw,
				totalQuestions: totalQuestions
			});
			return admin.save();
		})
		.then(result => {
			res.status(201).json({
				message: 'Admin created!',
				adminId: result._id
			});
		})
		.catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedAdmin; 
	Admin.findOne({ email: email })
	.then(admin => {
		if (!admin) {
			const error = new Error('Admin not found');
			error.statusCode = 401;
			throw error;
		}
		loadedAdmin = admin;
		return bcrypt.compare(password, admin.password);
	})
	.then(isEqual => {
		if (!isEqual) {
			const error = new Error('Wrong password');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign({
			email: loadedAdmin.email,
			adminId: loadedAdmin._id.toString()
		}, 
		'somesupersecretsecret', 
		{ expiresIn: '1h' }
		);
		res.status(200).json({ 
			token: token,
			adminId: loadedAdmin._id.toString()
		});
	}) 
	.catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
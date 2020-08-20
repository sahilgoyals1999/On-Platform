const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
	 	console.log(errors);
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password; 
	bcrypt.hash(password, 12)
		.then(hashedPw => {
			const user = new User({
				email: email,
				name: name,
				password: hashedPw
			});
			return user.save();
		})
		.then(result => {
			res.status(201).json({
				message: 'User created!',
				userId: result._id
			});
		})
		.catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser; 
	User.findOne({ email: email })
	.then(user => {
		if (!user) {
			const error = new Error('User not found');
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;
		return bcrypt.compare(password, user.password);
	})
	.then(isEqual => {
		if (!isEqual) {
			const error = new Error('Wrong password');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign({
			email: loadedUser.email,
			userId: loadedUser._id.toString()
		}, 
		'somesupersecretsecret', 
		{ expiresIn: '1h' }
		);
		res.status(200).json({ token: token, userId: loadedUser._id.toString() });
	}) 
	.catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
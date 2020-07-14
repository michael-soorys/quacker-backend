var express = require('express');
var api = express.Router();
var passportMiddleware = require('../middleware/passportMiddleware');

const mongoose = require('mongoose');

// Destructure passport middleware
const { jwtChecker, passportRegister, passportLogin } = passportMiddleware;

api.get('/explore', function (req, res, next) {
	res.send('test');
});

// Login and registration routes
api.post('/register', passportRegister);
api.post('/login', passportLogin);

/**
 *
 * Protected routes bellow
 *
 */

api.use(jwtChecker); // Verify JWT token

api.get('/test', (req, res, next) => {
	res.send('found');
});

// Explore page for logged in user
api.get('/user/explore', (req, res, next) => {});

// Access to the user's followers
api.get('/user/followers', (req, res, next) => {});

// Access to the user's following
api.get('/user/following', (req, res, next) => {});

// Get other random users that the user doesn't follow
api.get('/users/random', (req, res, next) => {});

// Get other random quacks that the user doesn't follow
api.get('/quacks/random', (req, res, next) => {});

// Get the user's feed
api.get('/feed', (req, res, next) => {});

// Get the data of the user with an ID of :id. This includes the user's own id as a possibility
api.get('/user/:id', (req, res, next) => {});

// Get the user's own profile
api.get('/profile', (req, res, next) => {});

// Update the user's profile with an avatar/bio
api.patch('/profile', (req, res, next) => {});

// Post a quack
api.post('/quack', (req, res, next) => {});

// Delete a quack
api.delete('/quack', (req, res, next) => {});

// Follow a user
api.post('/follow', (req, res, next) => {});

// Unfollow a user
api.delete('/follow', (req, res, next) => {});

// Post a quack, includes requacks
api.post('/quack/comment', (req, res, next) => {});

// Like a quack
api.post('/quack/like', (req, res, next) => {});

module.exports = api;

const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean-docker';

// Connect to mongodb
const connection = mongoose.connect(dbHost);
autoIncrement.initialize(connection);

// create mongoose schema
const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    created: {type: Date, default: Date.now}
});
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 1,
    incrementBy: 1
});

// create mongoose model
const User = mongoose.model('User', userSchema);

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('API works');
});

/* GET all users. */
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.status(500).send(error)

        res.status(200).json(users);
    });
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
    User.findById(req.param.id, (err, users) => {
        if (err) res.status(500).send(error)

        res.status(200).json(users);
    });
});

/* Create a user. */
router.post('/users', (req, res) => {
    let user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    user.save(error => {
        if (error) res.status(500).send(error);

        res.status(201).json({
            message: 'User created successfully'
        });
    });
});



module.exports = router;

const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean-docker';

// Connect to mongodb
const connection = mongoose.connect(dbHost);
autoIncrement.initialize(connection);


// create mongoose schemas
const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    token: String,
    created: {type: Date, default: Date.now}
});
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 1,
    incrementBy: 1
});

// create mongoose model
const User = mongoose.model('User', userSchema);


const activitySchema = new mongoose.Schema({
    userId: Number,
    dateTime: {type: Date},
    description: String,
    weightValue: Number,
    syncedDateTime: {type: Date, default: Date.now}
});
activitySchema.plugin(autoIncrement.plugin, {
    model: 'Activity',
    startAt: 1,
    incrementBy: 1
});

// create mongoose model
const Activity = mongoose.model('Activity', activitySchema);


const weightSchema = new mongoose.Schema({
    userId: Number,
    dateTime: {type: Date},
    weight: Number,
    syncedDateTime: {type: Date, default: Date.now}
});
weightSchema.plugin(autoIncrement.plugin, {
    model: 'Weight',
    startAt: 1,
    incrementBy: 1
});
const Weight = mongoose.model('Weight', weightSchema);

var validatedUser = null;

const nonValidatedPaths = ['/', 'authenticate'];

function checkAuthorization(req, res, next) {
  validatedUser = null;
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    req.token = bearerToken;
    console.log(req.token);
    User.findOne({token: req.token}, '-password', function (err, user) {
      if (user) {
        validatedUser = user;
      } else {
        // Token not found in database
        res.send(403);
      }
      next();
    });
  } else {
    res.send(403);
    next();
  }
}

function confirmValidatedUser(res, userId) {
  if (userId && validatedUser && userId == validatedUser._id) {
    return true;
  } else {
    res.sendStatus(403);
    return false;
  }
}

function generateNewUserToken(user) {
  return jwt.sign(user.toJSON(), "Not Secure!");
}

function saveUserWithNewToken(user) {
  user.token = generateNewUserToken(user);
  user.save(function(error, savedUser) {
    if (error) {
      console.log(error);
    } else {
      return savedUser;
    }
  });
  return user;
}


router.use(function(request, response, next) {
  if(request.method == "OPTIONS") {
    next();
  } else {
    console.log("Before!!!");
    next();
  }
});

/* GET api listing. */
router.get('/', (req, res, next) => {
    res.send('API works');
    next();
});

router.post('/authenticate', (req, res, next) => {
  User.findOne({email: req.body.email, password: req.body.password}, '-password', function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: "Error occurred: "+ err
      });
      next();
    } else {
      if (user) {
        res.json({
          type: true,
          data: user,
          token: user.token
        });
        next();
      } else {
        res.json({
          type: false,
          data: "Incorrect email/password"
        });
        next();
      }
    }
  });
});

/* GET all users. */
router.get('/users', checkAuthorization, (req, res, next) => {
    User.find({ }, '-password', (err, users) => {
        if (err) {
          res.status(500).send(error)
        } else {
          res.status(200).json(users);
        }
        next();
    });
});

/* GET one user. */
router.get('/users/:id', checkAuthorization, (req, res, next) => {
  if (confirmValidatedUser(res, req.param.id)) {
    User.findById(req.param.id, '-password', (err, users) => {
        if (err) {
          res.status(500).send(error)
        } else {
          res.status(200).json(users);
        }
        next();
    });
  }
});

/* Create a user. */
router.post('/users', checkAuthorization, (req, res, next) => {
    let userModel = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    });

    userModel.save(function(error, user) {
        if (error) {
          res.status(500).send(error);
        } else {
          savedUser = saveUserWithNewToken(user);
          res.status(201).json({
                success: true,
                data: savedUser,
                token: savedUser.token
          });
        }
        next();
    });
});

/* GET all activities */
router.get('/activities', checkAuthorization, (req, res, next) => {
    Activity.find({}, (err, activities) => {
        if (err) {
          res.status(500).send(error);
        } else {
          res.status(200).json(activities);
        }
        next();
    });
});

// Get all the activities for a provided user
router.get('/activities/user/:userId', checkAuthorization, (req, res, next) => {
  if (confirmValidatedUser(res, req.params.userId)) {
    Activity.find({ userId: req.params.userId }, function (err, activities) {
        if(err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(activities);
        }
        next();
    });
  }
});

/* Create an activity */
router.post('/activities', checkAuthorization, (req, res, next) => {
    let activity = new Activity({
        userId: req.body.userId,
        dateTime: req.body.dateTime,
        description: req.body.description,
        weightValue: req.body.weightValue
    });

    activity.save(error => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(201).json({
              message: 'Activity created successfully'
          });
        }
        next();
    });
});


/* GET all user weights */
router.get('/weights', checkAuthorization, (req, res, next) => {
    Weight.find({}, (err, weights) => {
        if (err) {
          res.status(500).send(error);
        } else {
          res.status(200).json(weights);
        }
    });
});

/**
 * Get all of the weights for a specifc user
 */
router.get('/weights/user/:userId', checkAuthorization, (req, res, next) => {
  if (confirmValidatedUser(res, req.params.userId)) {
    Weight.find({ userId: req.params.userId }, function (err, weights) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json(weights);
        }
        next();
    });
  }
});

/* Create a weight */
router.post('/weights', checkAuthorization, (req, res, next) => {
  if (confirmValidatedUser(res, req.body.userId)) {
    let weight = new Weight({
        userId: req.body.userId,
        dateTime: req.body.dateTime,
        weight: req.body.weight
    });

    weight.save(error => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).json({
              message: 'Weight created successfully'
          });
        }
        next();
    });
  }
});

router.post('/settings', checkAuthorization, (req, res, next) => {
    switch(req.body.action) {
        case 'delete':
            switch(req.body.fieldName) {
                case 'weight':
                    Weight.findById(req.body.fieldId, (err, weight) => {
                        if (err) res.status(500).send(err)

                        weight.remove();
                    });
                    break;
                case 'activity':
                    Activity.findById(req.body.fieldId, (err, activity) => {
                        if (err) res.status(500).send(err)

                        activity.remove();
                    });
                    break;
                case 'person':
                    User.findById(req.body.fieldId, (err, user) => {
                        if (err) res.status(500).send(err)

                        user.remove()
                        Weight.deleteMany({userId: req.body.fieldId}, function (err) {});
                        Activity.deleteMany({userId: req.body.fieldId}, function (err) {});

                    });
                    break;
                default:
                    res.status(500).json({
                        message: "Invalid type provided"
                    });
            }
            break;
        default:
            res.status(500).json({
                message: "Invalid action provided"
            });
    }
    res.status(200).json({
        fieldName: req.body.fieldName,
        fieldId: req.body.fieldId
    });
    next();
});

router.use(function(request, response, next) {
  if(request.method == "OPTIONS") {
    next();
  } else {
    console.log("After!");
    next();
  }
});

module.exports = router;

const express = require('express');

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// Health check
userRoutes.route('/').get((req, res) => {
  res.status(200).send(`Health check`);
});

// This section will help you get a list of all the userData.
userRoutes.route('/users').get((req, res) => {
  let db_connect = dbo.getDb('users');
  db_connect
    .collection('userData')
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single users by id
userRoutes.route('/users/:id').get((req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection('userData').findOne(myquery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new users.
userRoutes.route('/users/add').post((req, response) => {
  let db_connect = dbo.getDb();
  let myobj = {
    userName: req.body.userName,
    data: req.body.data,
  };
  db_connect.collection('userData').insertOne(myobj, (err, res) => {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a users by id.
userRoutes.route('/update/:id').post((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      userName: req.body.userName,
      data: req.body.data,
    },
  };
  db_connect
    .collection('userData')
    .updateOne(myquery, newvalues, (err, res) => {
      if (err) throw err;
      console.log('1 document updated');
      response.json(res);
    });
});

// This section will help you delete a users by id
userRoutes.route('/:id').delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection('userData').deleteOne(myquery, (err, obj) => {
    if (err) throw err;
    console.log('1 document deleted');
    response.json(obj);
  });
});

module.exports = userRoutes;

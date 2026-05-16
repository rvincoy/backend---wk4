const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createContact = async (req, res, next) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const result = await mongodb.getDb().db().collection('contacts').insertOne(contact);
  if (result.acknowledged) {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(result);
  } else {
    res.status(500).json({ message: 'Failed to create contact' });
  }
};

const updateContact = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const result = await mongodb.getDb().db().collection('contacts').updateOne({ _id: userId }, { $set: contact });
  if (result.modifiedCount > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(204).json({ message: 'Contact updated successfully' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
};

const deleteContact = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: userId });
  if (result.deletedCount > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Contact deleted successfully' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };

const db = require("../models");

// Defining methods for the notesController
module.exports = {
  findAll: function (req, res) {
    db.Note.find(req.query)
      .sort({ date: -1 })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Note.find({ _id: req.params.id })
      .populate("gifts")
      .populate("user")
      .then((dbModel) => {
        res.json(dbModel);
        console.log(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    db.Note.create(req.body)
      .then((dbModel) => {
        console.log(dbModel);
        res.json(dbModel);
      })
      .catch((err) => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Note.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Note.findById({ _id: req.params.id })
      .then((dbModel) => dbModel.remove())
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
};

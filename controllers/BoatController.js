const Boat = require('../models/Boat')

const index = (req, res, next) => {
  Boat.find()
    .then((response) => {
      res.json({
        response,
      })
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured!',
      })
    })
}

const show = (req, res, next) => {
  let boatItem = req.body.boatItem
  Boat.findById(boatItem)
    .then((response) => {
      res.json({
        response,
      })
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured!',
      })
    })
}

const store = (req, res, next) => {
  let boat = new Boat({
    name: req.body.name,
    class: req.body.class,
    capacity: req.body.capacity,
    image: req.body.image,
  })

  if (req.file) {
    boat.image = req.file.path
  }

  boat
    .save()
    .then((response) => {
      res.json({
        message: 'Boat Added Successfully!',
      })
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured!',
      })
    })
}

const update = (req, res, next) => {
  let boatItem = req.body.boatItem

  let updatedData = {
    name: req.body.name,
    class: req.body.class,
    capacity: req.body.capacity,
    image: req.body.image,
  }

  Boat.findByIdAndUpdate(boatItem, { $set: updatedData })
    .then(() => {
      res.json({
        message: 'Boat Updated Successfully!',
      })
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured!',
      })
    })
}

const destroy = (req, res, next) => {
  let boatItem = req.body.boatItem
  Boat.findByIdAndRemove(boatItem)
    .then(() => {
      res.json({
        message: 'Boat Deleted Successfully!',
      })
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured!',
      })
    })
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
}

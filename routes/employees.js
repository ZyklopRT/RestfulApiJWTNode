const express = require('express')
const path = require('path');
const router = express.Router();
const data = {};
data.employees = require('../models/employees.json')

router.route('/')
    .get((req, res) => {
        res.json(data.employees)
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
        })
    })
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
        })
    })
    .delete((req, res) => {
        res.json({
            "id": req.body.id,
        })
    });

router.route('/:id')
    .get((req, res) => {
        const employee = data.employees.find(e => e.id === req.params.id)
        res.json({employee})
    })

module.exports = router;

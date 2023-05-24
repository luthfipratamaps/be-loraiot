const router = require('express').Router();
const { mon } = require('../controllers');

router.get('/data', mon.getData);
router.get('/data/:date', mon.getDataByDate);
router.get('/monthly-data/:month', mon.getDataByMonth);
router.get('/available-dates', mon.getAvailableDates);

module.exports = router;
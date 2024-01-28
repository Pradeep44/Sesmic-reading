const moment = require('moment');
const file = require('node:fs')
const multer  = require('multer')
const upload = multer({ dest: './inputs' })

const express = require("express");
const Reading = require('../schemas/Reading');

const router = express.Router();

router.get("/", (req, res) =>
  res.json({
    status: 200,
    message: "Welcome to this route",
  })
);

router.post('/load-data', upload.single('readings'), async(req, res) => {
  file.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const array = data.split('\n');

    array.map(e => {
      const datePattern = /(\d{8})/g;
      const dates = e.match(datePattern);
      const readings = e.split(datePattern).filter(Boolean);

      let entries = dates.map(date => {
        const [year, month, day] = [date.slice(0, 4), date.slice(4, 6), date.slice(6)];

        if(moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').isValid()) {
          const index = readings.indexOf(date);
          const data = readings[index+1];
          const frequncies = data.trim().split(' ').map(x => parseFloat(x));
          return {
            year: year,
            month: month.replace(/^0+/, ''),
            day: day.replace(/^0+/, ''),
            frequency: frequncies,
            hasNegativeFrequncy: frequncies.some(x => x< 0)
          }
        } else {
          return null;
        }
      })

      entries = entries.filter(x => !!x);
      const index = entries.findIndex(x => x.hasNegativeFrequncy);

      if(index > 0) {
        entries.splice(index);
      }

      entries.map(async entry => {
        await Reading.create({
          ...entry
        })
      });
    })

  });

  file.unlink(req.file.path, (err) => {
    if (err) throw err;
    console.log(`${req.file.path} is deleted`);
  });
  return res.status(200).send({ message: 'Data loaded to db' })
})

router.get('/get-data', async(req,res,) => {
  const { day, month, year} = req.query;

  let query = {};

  if(day) {
    query.day = day; 
  }

  if(month) {
    query.month = month;
  }

  query.year = year;

  const readings = await Reading.find(query);

  let data = {};
  let status = 200;

  if(!readings.length) {
    data.message = "Not found";
    status = 404;
  } else {
    data = readings.map(reading => {
      return {
        day: reading.day,
        month: reading.month,
        year: reading.year,
        max: Math.max(...reading.frequency),
        min: Math.min(...reading.frequency),
        count: reading.frequency.length
      }
    })
  }

  return res.status(status).send({ data });
})

module.exports = router;

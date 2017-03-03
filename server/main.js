import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron'
import scraperjs from 'scraperjs'

import { Prices } from '../imports/api/prices'

const rdpdSeminar = {
  name: 'Rich Dad Poor Dad 3 Day Real Estate Seminar',
  url: 'https://richdadeducation.com/3DayTraining/RealEstate/Register',
  divId: '#divAmount'
}

const surfacePro4 = {
  name: 'Surface Pro 4 i5, 8GB RAM, 256GB',
  url: 'https://www.amazon.com/dp/B01606IDL0/ref=twister_B0169A7O62?_encoding=UTF8&psc=1',
  divId: '#priceblock_ourprice'
}

const surfacePro4i7 = {
  name: 'Surface Pro 4 i7, 8GB RAM, 256GB',
  url: 'https://www.amazon.com/dp/B01605ZRBK/ref=twister_B0169A7O62?_encoding=UTF8&th=1',
  divId: '#priceblock_ourprice'
}

function scrapeSites() {
  // Rich dad poor dad 3 day seminar
  scraperjs.StaticScraper.create(rdpdSeminar.url)
  .scrape(function($) {
    return $("#divAmount").map(function() {
      return $(this).text().match(/\$.*/);
    }).get();
  })
  .then(Meteor.bindEnvironment(function(price) {
    if (typeof price === 'object') price = price[0]
    let message = `The price of the Rich Dad Poor Dad 3 Day Seminar has changed. It is now $${price}`
    message += `\n${rdpdSeminar.url}`
    Meteor.call('newPrice', price, rdpdSeminar)
  }))
}

SyncedCron.add({
  name: 'Get prices',
  schedule(parser) {
    return parser.text('every 1 hours')
  },
  job() {
    scrapeSites()
  }
})

Meteor.startup(function () {
  process.env.TWILIO_ACCOUNT_SID = 'AC39590e0b047a8d8f43334d4a52b2a388';
  process.env.TWILIO_AUTH_TOKEN = '142baeef915c558c1d54d9b42dd94071';

  scrapeSites();
  SyncedCron.start();
})

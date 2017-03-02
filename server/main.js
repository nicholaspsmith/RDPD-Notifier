import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron'
import scraperjs from 'scraperjs'

import { Prices } from '../imports/api/prices'

const rdpdSeminar = {
  name: 'Rich Dad Poor Dad 3 Day Real Estate Seminar',
  url: 'https://richdadeducation.com/3DayTraining/RealEstate/Register'
}

const surfacePro4 = {
  name: 'Surface Pro 4 i5, 8GB RAM, 256GB',
  url: 'https://www.amazon.com/gp/product/B01606IDL0/ref=ox_sc_sfl_title_2?ie=UTF8&psc=1&smid=A1BCG1Y536QVQG',
}

SyncedCron.add({
  name: 'Get the date!',
  schedule(parser) {
    return parser.text('every 1 hours')
  },
  job() {
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
      Meteor.call('newPrice', price, rdpdSeminar.name, message)
    }))

    // surface pro 4
    scraperjs.StaticScraper.create(surfacePro4.url)
    .scrape(function($) {
      return $("#priceblock_ourprice").map(function() {
        return $(this).text().match(/\$.*/);
      }).get();
    })
    .then(Meteor.bindEnvironment(function(price) {
      if (typeof price === 'object') price = price[0]
      let message = `The price of ${surfacePro4.name} has changed. It is now ${price}`
      Meteor.call('newPrice', price, surfacePro4.name, message)
    }))

    
  }
})

Meteor.startup(function () {
  process.env.TWILIO_ACCOUNT_SID = 'AC39590e0b047a8d8f43334d4a52b2a388';
  process.env.TWILIO_AUTH_TOKEN = '142baeef915c558c1d54d9b42dd94071';

	SyncedCron.start();
})

import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron'
import scraperjs from 'scraperjs'

import { Prices } from '../imports/api/prices'

SyncedCron.add({
  name: 'Get the date!',
  schedule(parser) {
    return parser.text('every 1 hours')
  },
  job() {
	scraperjs.StaticScraper.create('https://richdadeducation.com/3DayTraining/RealEstate/Register/')
    .scrape(function($) {
        return $("#divAmount").map(function() {
            return $(this).text().match(/\$.*/);
        }).get();
    })
    .then(Meteor.bindEnvironment(function(price) {
        Meteor.call('newPrice', price[0])
    }))
  }
})

Meteor.startup(function () {
  process.env.TWILIO_ACCOUNT_SID = 'AC39590e0b047a8d8f43334d4a52b2a388';
  process.env.TWILIO_AUTH_TOKEN = '142baeef915c558c1d54d9b42dd94071';

	SyncedCron.start();
})

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {sendMessage} from './twilio'

const nick = '+19158619472'

export const Prices = new Mongo.Collection('prices')

Meteor.methods({
	'newPrice'(priceFromScraper) {
		const existingPrices = Prices.find({}, {sort: {date: -1} }).fetch()
		let oldPrice = existingPrices[0].price
		let price = parseInt(priceFromScraper.replace('$', ''))

		if (price != oldPrice) {
			console.log('oldPrice ', oldPrice)
			console.log('price ', price)
			Prices.insert({ price, date: new Date() })
			let message = `The price of the Rich Dad Poor Dad 3 Day Seminar has changed. It is now $${price}`
			message += '\nhttps://richdadeducation.com/3DayTraining/RealEstate/Register'
			sendMessage(message, nick)
		} else {
			console.log('Prices are the same ' + new Date())
		}
	}
})
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {sendMessage} from './twilio'

const nick = '+19158619472'

export const Prices = new Mongo.Collection('prices')

Meteor.methods({
	'newPrice'(priceFromScraper, name, message) {
		let price = parseInt(priceFromScraper.replace('$', '').replace(',',''))
		const existingPrices = Prices.find({ name }, {sort: {date: -1} }).fetch()
		if (existingPrices.length === 0) {
			Prices.insert({ name, price, date: new Date() })
			sendMessage(`Added ${name} to price tracker`)
		} else {
			let oldPrice = existingPrices[0].price

			if (price != oldPrice) {
				Prices.insert({ name, price, date: new Date() })
				console.log(message)
				sendMessage(message, nick)
			} else {
				console.log('Price is same ' + new Date())
			}
		}
	}
})
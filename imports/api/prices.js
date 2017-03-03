import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {sendMessage} from './twilio'

const nick = '+19158619472'

export const Prices = new Mongo.Collection('prices')

Meteor.methods({
	'newPrice'(priceFromScraper, product) {
		if (typeof priceFromScraper === 'undefined') {
			console.log(`${product.name} price is undefined :(`)
		} else {		
			let price = parseInt(priceFromScraper.replace('$', '').replace(',',''))
			const existingPrices = Prices.find({ name: product.name }, {sort: {date: -1} }).fetch()
			if (existingPrices.length === 0) {
				Prices.insert({ name: product.name, price, date: new Date() })
				let message = `Added ${product.name} to price tracker`
				sendMessage(message, nick)
			} else {
				let oldPrice = existingPrices[0].price

				if (price != oldPrice) {
					Prices.insert({ name: product.name, price, date: new Date() })
			    let message = `The price of ${product.name} has changed. It is now $${price}`
					console.log(message)
					sendMessage(message, nick)
				} else {
					console.log(`Price of ${product.name} is ${price}`)
				}
			}
		}
	}
})
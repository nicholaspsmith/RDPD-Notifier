import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Prices } from '../imports/api/prices'

import './main.html';

Template.body.helpers({
  prices() {
    return Prices.find();
  },
});


'use strict';

import Backbone from 'backbone';
import userCommandModel from './userCommandModel';

export default Backbone.Collection.extend({
	model: userCommandModel
});
'use strict';

import Backbone from 'backbone';
import userCommandModel from './modeModel';

export default Backbone.Collection.extend({
	model: userCommandModel
});
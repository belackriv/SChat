'use strict';

import Backbone from 'backbone';
import UserModel from './userModel.js';

export default Backbone.Collection.extend({
	model: UserModel,
	comparator: 'nick'
});
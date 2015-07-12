'use strict';

import Backbone from 'backbone';
import UserModel from './userModel';

export default Backbone.Collection.extend({
	model: UserModel
});
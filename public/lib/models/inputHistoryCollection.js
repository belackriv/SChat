'use strict';

import Backbone from 'backbone';
import InputHistoryModel from './inputHistoryModel.js';

export default Backbone.Collection.extend({
	model: InputHistoryModel
});
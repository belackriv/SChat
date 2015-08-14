'use strict';

import Backbone from 'backbone';
import InputHistoryModel from './inputHistoryModel';

export default Backbone.Collection.extend({
	model: InputHistoryModel
});
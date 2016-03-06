'use strict';

import Backbone from 'backbone';
import MessageModel from './messageModel.js';

export default Backbone.Collection.extend({
	model: MessageModel
});
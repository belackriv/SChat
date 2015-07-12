'use strict';

import Backbone from 'backbone';
import MessageModel from './messageModel';

export default Backbone.Collection.extend({
	model: MessageModel
});
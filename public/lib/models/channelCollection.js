'use strict';

import Backbone from 'backbone';
import ChannelModel from './channelModel.js';

export default Backbone.Collection.extend({
	model: ChannelModel
});
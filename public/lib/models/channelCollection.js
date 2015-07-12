'use strict';

import Backbone from 'backbone';
import ChannelModel from './channelModel';

export default Backbone.Collection.extend({
	model: ChannelModel
});
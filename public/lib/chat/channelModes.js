'use strict';

import Marionette from 'marionette';
import channelModeTemplate from './channelMode.hbs!';
import Radio from 'backbone.radio';

var ChannelModeView = Marionette.ItemView.extend({
	template: channelModeTemplate,
});

export default Marionette.CollectionView.extend({
	childView: ChannelModeView
});
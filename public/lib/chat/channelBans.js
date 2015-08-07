'use strict';

import Marionette from 'marionette';
import channelBanTemplate from './channelBan.hbs!';
import Radio from 'backbone.radio';

var ChannelBanView = Marionette.ItemView.extend({
	template: channelBanTemplate,
	tagName: 'li',
	className: 'list-group-item'
});

export default Marionette.CollectionView.extend({
	childView: ChannelBanView,
	tagName: 'ul',
	className: 'list-group'
});
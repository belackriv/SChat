'use strict';

import Marionette from 'marionette';
import channelBanTemplate from './channelBan.hbs!';
import Radio from 'backbone.radio';

var ChannelBanView = Marionette.ItemView.extend({
	template: channelBanTemplate,
	tagName: 'li',
	className: 'list-group-item',
	ui: {
		'removeButton': 'button'
	},
	triggers: {
		'click @ui.removeButton': 'ban:remove'
	}
});

export default Marionette.CollectionView.extend({
	childView: ChannelBanView,
	tagName: 'ul',
	className: 'list-group',
	onChildviewBanRemove(childView){
		Radio.channel('channels').trigger('ban:remove', this.options.channelModel, childView.model);
	}	
});
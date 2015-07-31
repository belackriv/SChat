'use strict';

import Marionette from 'marionette';
import Radio from 'backbone.radio';
import contextMenuItemTemplate from './contextMenuItem.hbs!';

export default Marionette.ItemView.extend({
	template: contextMenuItemTemplate,
	tagName: 'li',
	className(){
		var className = 'cursor-pointer';
		var myUserModel = Radio.channel('users').request('getMyUserModelForChannel', this.options.channelModel.get('name') );
		if(myUserModel == null || this.model.get('roles').indexOf(myUserModel.get('roleName')) == -1){
			className += ' disabled';
		}
		return className;
	},
	triggers: {
		'click': 'run:command'
	}
});

'use strict';

import Marionette from 'marionette';
import Radio from 'backbone.radio';
import ContextMenuItem from './contextMenuItem.js';

export default Marionette.CollectionView.extend({
	childView: ContextMenuItem,
	tagName: 'ul',
	className: 'dropdown-menu',
	childViewOptions(){
		return {
			userModel: this.options.userModel,
			channelModel: this.options.channelModel
		};
	},
	onChildviewRunCommand(childView){
		var myUserModel = Radio.channel('users').request('getMyUserModelForChannel', this.options.channelModel.get('name') );
		if(myUserModel != null && childView.model.get('roles').indexOf(myUserModel.get('roleName')) > -1){
			var eventName = childView.model.get('eventName');
			Radio.channel('users').trigger(eventName, this.options.channelModel, this.options.userModel);
			Radio.channel('channels').trigger(eventName, this.options.channelModel, this.options.userModel);
			Radio.channel('contextMenu').trigger('close');
		}
	}
});

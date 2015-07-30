'use strict';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import userContextMenuItemTemplate from './userContextMenuItem.hbs!';
import modes from 'lib/models/modes';
import Radio from 'backbone.radio';


var ContextMenuRegion = Marionette.Region.extend({
	onBeforeShow(view, region, options){
		region.$el.position({
			my: "left+3 bottom-3",
			of: options.event,
			collision: "fit"
		});
		region.open(view);
		$('body').on('click contextmenu', function(event){
			/*
			if(event.target != view.el && view.$el.has(event.target).length == 0){
				region.close(view);
			}
			if(event.type == 'contextmenu'){
				if(event.target == view.el || view.$el.has(event.target).length){
					event.preventDefault();
					event.stopPropagation();
				}
			}*/
			region.close(view);
		});
	},
	open(view){
		if(view){
			view.$el.css('display','block');
		}else if(this.currentView){
			this.currentView.$el.css('display','block');
		}
	},
	close(view){
		if(view){
			view.$el.css('display','none');
		}else if(this.currentView){
			this.currentView.$el.css('display','none');
		}
	}
});

var UserContextMenuItem = Marionette.ItemView.extend({
	template: userContextMenuItemTemplate,
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

var UserContextMenu = Marionette.CollectionView.extend({
	childView: UserContextMenuItem,
	tagName: 'ul',
	className: 'dropdown-menu',
	childViewOptions(){
		return {
			userModel: this.options.userModel,
			channelModel: this.options.channelModel
		};
	},
	onChildviewRunCommand(childView){
		var eventName = childView.model.get('eventName').toLowerCase();
		Radio.channel('users').trigger(eventName, this.options.userModel, this.options.channelModel);
	}
});

var UserChildView = Marionette.ItemView.extend({
	template: userTemplate,
	className:'list-group-item schat-user-item',
	tagName: 'li',
	events:  {
		'click': '_handleClick',
		'contextmenu': '_handleContextMenu'
	},
	modelEvents: {
		'change': 'render'
	},
	onRender(){
		this._renderUserActive();
		this._renderUserRoleBackground();
	},
	_renderUserActive(){
		if(this.model.get('isActive')){
			this.$el.addClass('active');
		}else{
			this.$el.removeClass('active');
		}
	},
	_renderUserRoleBackground(){
		this.$el.removeClass(' schat-user-role-op');
		this.$el.removeClass(' schat-user-role-voice');
		if(this.model.get('roleName')){
			this.$el.addClass(' schat-user-role-'+this.model.get('roleName'));
		}
	},
	_handleClick(event){
		this.model.set('isActive', true);
		this.triggerMethod('activate');
	},
	_handleContextMenu(event){
		event.preventDefault();
		event.stopPropagation();
		this._handleClick();
		this.triggerMethod('show:menu', event);
	}
});

var UserCollectionView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'list-group',
	childView: UserChildView,
	onAddChild(childView){
    this.triggerMethod('add:user');
  },
  onRemoveChild(childView){
    this.triggerMethod('remove:user');
  }
});

export default Marionette.LayoutView.extend({
	template: usersTemplate,
	childViewContainer: 'ul',
	modelEvents: {
		'change:userCount': '_renderUserCount'
	},
	ui:{
		userCountBadge: '.schat-user-count.badge'
	},
	regions:{
		'list': '#user_list_container',
		'menu': {
			selector: '#user_context_menu',
			regionClass: ContextMenuRegion
		}
	},
	onBeforeShow(){
		if(this.model){
			this.model.set('userCount', this.collection.length);
		}
		this.showChildView('list', new UserCollectionView({
			collection: this.collection
		}));
	},
	onChildviewActivate(childView){
		this.collection.each((model)=>{
			if(model != childView.model){
				model.set('isActive', false);
			}
		});
	},
	onChildviewShowMenu(childView, event){
		this.getRegion('menu').show(new UserContextMenu({
			collection: modes,
			userModel: childView.model,
			channelModel: this.model
		}),
		{
			event: event
		});
	},
	onChildviewAddUser(childView){
		this.model.set('userCount', this.model.get('userCount')+1);
	},
	onChildviewRemoveUser(childView){
		this.model.set('userCount', this.model.get('userCount')-1);
	},
	_renderUserCount(){
		if(this.ui.userCountBadge instanceof $){
			this.ui.userCountBadge.text( this.model.get('userCount') );
		}
	}
});

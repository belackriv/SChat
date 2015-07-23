'use strict';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import userContextMenuItemTemplate from './userContextMenuItem.hbs!';
import Radio from 'backbone.radio';


var ContextMenuRegion = Marionette.Region.extend({
	//el: '#context_menu',
	onBeforeShow(){
		var test;
	},
});

var UserContextMenuItem = Marionette.ItemView.extend({
	template: userContextMenuItemTemplate,
	tagName: 'li',
});

var UserContextMenu = Marionette.CollectionView.extend({
	childView: UserContextMenuItem,
	tagName: 'ul',
	className: 'dropdown-men'
});

var UserChildView = Marionette.ItemView.extend({
	template: userTemplate,
	className: 'list-group-item schat-user-item',
	tagName: 'li',
	ui: {
		"clickable": '.clickable'
	},
	events:  {
		'keydown' : '_handleKeydown',
		'mousedown': '_handleClick'
	},
	modelEvents: {
		'change': 'render'
	},
	onRender(){
		if(this.model.get('isActive')){
			this.$el.addClass('active');
		}else{
			this.$el.removeClass('active');
		}
	},
	_handleClick(event){
		event.preventDefault();
		event.stopImmediatePropagation();
		if(event.button == 0){
			this.model.set('isActive', true);
			this.triggerMethod('activate');
		}else if(event.button == 2){
			this.triggerMethod('show:menu');
		}
	},
	_handleKeydown(event){
		if(event.which == 27){
			var closeMEnu;
		}
	},
});

var UserCollectionView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'list-group',
	childView: UserChildView
});

export default Marionette.LayoutView.extend({
	template: usersTemplate,
	childViewContainer: 'ul',
	regions:{
		'list': '#user_list_container',
		'menu': '#user_context_menu'
	},
	onBeforeShow(){
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
	onChildviewShowMenu(childView){
		this.showChildView('menu', new UserContextMenu({
			collection: new Backbone.Collection([{name:childView.model.get('nick')}])
		}));
	}
});

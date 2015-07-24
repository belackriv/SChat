'use strict';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import userContextMenuItemTemplate from './userContextMenuItem.hbs!';
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
			if(event.target != view.el && view.$el.has(event.target).length == 0){
				region.close(view);
			}
			if(event.type == 'contextmenu'){
				if(event.target == view.el || view.$el.has(event.target).length){
					event.preventDefault();
					event.stopPropagation();
				}
			}
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
});

var UserContextMenu = Marionette.CollectionView.extend({
	childView: UserContextMenuItem,
	tagName: 'ul',
	className: 'dropdown-menu'
});

var UserChildView = Marionette.ItemView.extend({
	template: userTemplate,
	className: 'list-group-item schat-user-item',
	tagName: 'li',
	events:  {
		'click': '_handleClick',
		'contextmenu': '_handleContextMenu'
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
		this.model.set('isActive', true);
		this.triggerMethod('activate');
	},
	_handleContextMenu(event){
		event.preventDefault();
		event.stopPropagation();
		this.triggerMethod('show:menu', event);
	}
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
		'menu': {
			selector: '#user_context_menu',
			regionClass: ContextMenuRegion
		}
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
	onChildviewShowMenu(childView, event){
		this.getRegion('menu').show(new UserContextMenu({
			collection: new Backbone.Collection([{name:childView.model.get('nick')}])
		}),
		{
			event: event
		});
	}	
});

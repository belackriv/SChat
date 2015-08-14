'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import ModeCollection from 'lib/models/modeCollection';
import modes from 'lib/models/modes';
import Radio from 'backbone.radio';
import ContextMenu from './contextMenu';

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
    'list': '#user_list_container'
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
    var userContextModes = modes.filter((mode)=>{
      return mode.get('scopes').indexOf('userContext') > -1;
    });
    Radio.channel('contextMenu').trigger('open', event,
      new ContextMenu({
          collection: new ModeCollection(userContextModes),
          userModel: childView.model,
          channelModel: this.model
      }));
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

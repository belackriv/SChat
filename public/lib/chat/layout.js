'use strict';

import Radio from 'backbone.radio';
import Marionette from 'marionette';
import layoutTpl from './layout.hbs!';
import TabsView from './tabs';
import UsersView from './users';
import ChatView from './chat';


export default Marionette.LayoutView.extend({
  initialize(options){
    Radio.channel('chat').on('activate',this._activateChannel.bind(this));
  },
  className: 'schat-chat-layout-container',
  template: layoutTpl,
  regions: {
    tabs: "#chat_tabs_container",
    users: "#chat_users_container",
    messages: "#chat_messages_container"
  },
  onBeforeShow(){
    this.showChildView('tabs', new TabsView({
      collection: this.options.channelCollection
    }));
    this.showChildView('users', new UsersView());
    this.showChildView('messages', new ChatView());
  },
  _activateChannel(channelModel, usersCollection, messageCollection){
    this.showChildView('users', new UsersView({
      collection: usersCollection,
      model: channelModel
    }));
    this.showChildView('messages', new ChatView({
      collection: messageCollection,
      model: channelModel
    }));
  },
});
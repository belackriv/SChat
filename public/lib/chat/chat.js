'use strict';

import Marionette from 'marionette';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel'
import chatTemplate from './chat.hbs!';
import chatDefaultmsgTemplate from './chatDefaultmsg.hbs!';
import chatPrivmsgTemplate from './chatPrivmsg.hbs!';
import ModeCollection from 'lib/models/modeCollection';
import modes from 'lib/models/modes';
import ContextMenu from './contextMenu';






var ChatMsgView = Marionette.ItemView.extend({
  getTemplate(){
    switch(this.model.get('command')){
      case 'PRIVMSG':
        return chatPrivmsgTemplate;
      default:
        return chatDefaultmsgTemplate;
    }
  },
  onAttach(){
    this.el.scrollIntoView();
  },
});

export default Marionette.CompositeView.extend({
  childView: ChatMsgView,
  template: chatTemplate,
  className: 'schat-chat-container',
  childViewContainer: '.schat-messages-container',
  ui: {
    contentInput: 'input[name=content]',
    form: 'form',
    topic: '.schat-topic-container'
  },
  events: {
    'contextmenu': '_handleContextMenu',
    'keyup @ui.contentInput': '_handleKeyUp',
    'submit @ui.form': '_submitForm'
  },
  modelEvents: {
    'change:topic': '_changeTopic'
  },
  onAttach(){
    this.ui.contentInput.focus();
  },
  _changeTopic(){
    this.ui.topic.text(this.model.get('topic'));
  },
  _handleKeyUp(event){
    //if(event.keyCode == 13){
    //}
  },
  _handleContextMenu(event){
    event.preventDefault();
    event.stopPropagation();
    var channelContextModes = modes.filter((mode)=>{
      return mode.get('scopes').indexOf('channelContext') > -1;
    });
    if(this.model){
      Radio.channel('contextMenu').trigger('open', event,
        new ContextMenu({
          collection: new ModeCollection(channelContextModes),
          userModel: null,
          channelModel: this.model
      }));
    }
  },
  _submitForm(event){
    event.preventDefault();
    this._sendMessage();
  },
  _sendMessage(){
    var activeChannelName = Radio.channel('channels').request('getActiveChannelName');
    var content = this.ui.contentInput.val();
    if(content){
      var messageModel = new MessageModel();
      if(content.indexOf('/') == 0){
        var rawCommand = content.substring(1, content.indexOf(' '));
        var rawContent = content.substring(content.indexOf(' ')+1);
        messageModel.createCommand(rawCommand, rawContent);
      }else{
        messageModel.set({
          nick: Radio.channel('users').request('getMyNick'),
          command: 'PRIVMSG',
          channel: activeChannelName,
          content: content,
          timestamp: new Date()
        });
        this.collection.add(messageModel)  
      }
      Radio.channel('messages').trigger('send', messageModel);
      this.ui.contentInput.val('').focus();
    }
  }
});

'use strict';

import Marionette from 'marionette';
import Radio from 'backbone.radio';
import MessageModel from 'lib/models/messageModel'
import chatTemplate from './chat.hbs!';
import chatDefaultmsgTemplate from './chatDefaultmsg.hbs!';
import chatPrivmsgTemplate from './chatPrivmsg.hbs!';


var ChatMsgView = Marionette.ItemView.extend({
  getTemplate(){
    switch(this.model.get('command')){
      case 'PRIVMSG':
        return chatPrivmsgTemplate;
      default:
        return chatDefaultmsgTemplate;
    }
  }
});



export default Marionette.CompositeView.extend({
  childView: ChatMsgView,
  template: chatTemplate,
  childViewContainer: '.schat-messages-container',
  ui: {
    contentInput: 'input[name=content]',
    form: 'form',
    topic: '.schat-topic-container'
  },
  events: {
    //'keyup @ui.contentInput': '_sendMessage',
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
  _sendMessage(){
    //if(event.keyCode == 13){
      var activeChannelName = Radio.channel('channels').request('getActiveChannelName');
      var content = this.ui.contentInput.val();
      var messageModel = new MessageModel();
      if(content.indexOf('/') == 0){
        var rawCommand = content.substring(1, content.indexOf(' '));
        var rawContent = content.substring(content.indexOf(' ')+1);
        messageModel.createCommand(rawCommand, rawContent);
      }else{
        messageModel.set({
          nick: Radio.channel('users').request('getNick'),
          command: 'PRIVMSG',
          channel: activeChannelName,
          content: content,
          timestamp: new Date()
        });
        this.collection.add(messageModel)  
      }
      Radio.channel('messages').trigger('send', messageModel);      
      this.ui.contentInput.val('').focus();
    //}
  },
  _submitForm(event){
    event.preventDefault();
    this._sendMessage();
  }
});

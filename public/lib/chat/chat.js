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
import Handlebars from 'handlebars';

var ChatMsgView = Marionette.ItemView.extend({
  getTemplate(){
    switch(this.model.get('command')){
      case 'PRIVMSG':
        return chatPrivmsgTemplate;
      default:
        return chatDefaultmsgTemplate;
    }
  },
  ui:{
    'contentContainer': '.schat-messages-content'
  },
  onBeforeRender(){
    this._prepAlertedContent();
  },
  onRender(){
    this._renderNew();
    this._renderAlerted();
  },
  onAttach(){
    this.el.scrollIntoView();
  },
  modelEvents:{
    'change:new': '_renderNew'
  },
  _renderNew(){
    if(this.model.get('new')){
      this.$el.addClass('bg-warning');
    }else{
      this.$el.removeClass('bg-warning', 1000);
    }
  },
  _prepAlertedContent(){
    if(typeof this.model.get('content') === 'string'){
      if(this.model.get('alerted')){
        var myNick = Radio.channel('users').request('getMyNick');
        var content = this.model.get('content');
        this.model.set('content', Handlebars.Utils.escapeExpression(content));
        var contentWords = this.model.get('content').split(' ');
        for(var i=0,wordCount=contentWords.length; i < wordCount; i++ ){
          var word = contentWords[i];
          if(word.indexOf(myNick) > -1){
            contentWords[i] = '<span class="bg-primary">'+word+'</span>';
          }
        }
        this.model.set('content',  new Handlebars.SafeString(contentWords.join(' ')));
      }
    }
  },
  _renderAlerted(){
    if(this.model.get('alerted')){
      this.$el.addClass('bg-info');
    }else{
      this.$el.removeClass('bg-info');
    }
  }
});

export default Marionette.CompositeView.extend({
  childView: ChatMsgView,
  template: chatTemplate,
  className: 'schat-chat-container',
  childViewContainer: '.schat-messages-container',
  ui: {
    contentInput: 'input[name=content]',
    form: 'form',
    topic: '.schat-topic-container',
    mode: '.schat-mode-container'
  },
  events: {
    'contextmenu': '_handleContextMenu',
    'keyup @ui.contentInput': '_handleKeyUp',
    'submit @ui.form': '_submitForm'
  },
  modelEvents: {
    'change:topic': '_changeTopic',
    'change:modes': '_changeModes',
  },
  onAttach(){
    this.ui.contentInput.focus();
  },
  _changeTopic(){
    this.ui.topic.text(this.model.get('topic'));
  },
  _changeModes(){
    this.ui.mode.text(this._getModesStr(this.model.get('modes')));
  },
  _getModesStr(modes){
    var str = '';
    if(modes){
      str += '+';
      var limitStr = '';
      modes.each((mode)=>{
        if(mode.get('isSet')){
          str += mode.get('flag');
          if(mode.get('flag') == 'l'){
            limitStr = mode.get('param');
          }
        }
      });
      str += ' '+limitStr
    }
    return str;
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
          channel: this.model.get('name'),
          content: content,
          timestamp: new Date()
        });
        if(this._isMessageSendingAuthorized()){
          this.collection.add(messageModel);
        }
      }
      Radio.channel('messages').trigger('send', messageModel);
      this.ui.contentInput.val('').focus();
    }
  },
  _isMessageSendingAuthorized(){
    var isMessageSendingAuthorized = true;
    var channelIsModerated = false;
    if(this.model){
      this.model.get('modes').each((mode)=>{
        if(mode.get('flag') == 'm' && mode.get('isSet') == true){
          channelIsModerated = true;
        }
      });
    }
    if(channelIsModerated){
      var myUserModel = Radio.channel('users').request('getMyUserModelForChannel', this.model.get('name') );
      if( myUserModel && myUserModel.get('roles').indexOf('o') == -1 && myUserModel.get('roles').indexOf('v') == -1 ){  
        isMessageSendingAuthorized = false;
      }
    }
    return isMessageSendingAuthorized;
  }
});

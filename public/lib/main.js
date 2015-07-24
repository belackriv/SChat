'use strict';

import 'backbone';
import 'jquery';
import 'jquery-ui';
import 'bootstrap';
import App from './app';
import socketService from './services/socket';
import channelService from './services/channel';
import userService from './services/user';
import messageService from './services/message';

channelService.setup();
channelService.start();
userService.start();
messageService.setup({
  channelCollection: channelService.collection
});
messageService.start();

var app = new App({
	channelCollection: channelService.collection
});

app.start();

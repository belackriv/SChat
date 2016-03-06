'use strict';

import 'backbone';
import 'jquery';
import 'jquery-ui/themes/ui-lightness/jquery-ui.min.css!';
import 'jquery-ui';
import 'bootstrap/css/bootstrap.min.css!';
import 'bootstrap';
import './handlebarsHelpers';
import App from './app.js';
import socketService from './services/socket.js';
import channelService from './services/channel.js';
import userService from './services/user.js';
import messageService from './services/message.js';

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

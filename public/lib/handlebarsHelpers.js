'use strict';

import Handlebars from 'handlebars';
import Moment from 'moment';
import ChatView from 'lib/chat/chat'

Handlebars.registerHelper('moment', function(date, options) {
	var formatStr = 'ddd, MMM D HH:mm:ssA';
	if(options && options.format){
		formatStr = options.format;
	}
	return moment(date).format(formatStr);
});

Handlebars.registerHelper('getModesStr', ChatView.prototype._getModesStr);
'use strict';

import Handlebars from 'handlebars';
import Moment from 'moment';

Handlebars.registerHelper('moment', function(date, options) {
	var formatStr = 'ddd, MMM D HH:mm:ssA';
	if(options && options.format){
		formatStr = options.format;
	}
	return moment(date).format(formatStr);
});
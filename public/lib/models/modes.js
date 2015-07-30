'use strict';

import modeCollection from 'lib/models/modeCollection';

export default new modeCollection([
	{
		label: 'Who Is?',
		eventName: 'whois',
		roles: ['op', 'voice', null]
	},
	{
		label: 'Op',
		eventName: 'op',
		roles: ['op']
	},
	{
		label: 'De-Op',
		eventName: 'deop',
		roles: ['op']
	},
	{
		label: 'Voice',
		eventName: 'voice',
		roles: ['op']
	},
	{
		label: 'De-Voice',
		eventName: 'devoice',
		roles: ['op']
	},
	{
		label: 'Kick',
		eventName: 'kick',
		roles: ['op']
	},
	{
		label: 'Ban',
		eventName: 'ban',
		roles: ['op']
	}
]);
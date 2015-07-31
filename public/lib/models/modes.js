'use strict';

import ModeCollection from 'lib/models/ModeCollection';

export default new ModeCollection([
	{
		label: 'Who Is?',
		eventName: 'whois',
		symbol:  null,
		type: 'query',
		roles: ['op', 'voice', null],
		scopes: ['userContext']
	},
	{
		label: 'Op',
		eventName: 'op',
		type: 'mode',
		symbol:  'o',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'De-Op',
		eventName: 'deop',
		symbol:  'o',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Voice',
		eventName: 'voice',
		symbol:  'v',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'De-Voice',
		eventName: 'devoice',
		symbol:  'v',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Kick',
		eventName: 'kick',
		symbol:  null,
		type: 'command',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Show Channel Modes Dialog',
		eventName: 'showChannelModes',
		symbol:  null,
		type: 'action',
		roles: ['op'],
		scopes: ['channelContext']
	},
	{
		label: 'Private',
		eventName: 'private',
		symbol:  'p',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Secret',
		eventName: 'secret',
		symbol:  's',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Invite-Only',
		eventName: 'inviteOnly',
		symbol:  'i',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Only Ops Set Topic',
		eventName: 'opsSetTopic',
		symbol:  't',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
  {
		label: 'No External Messsages',
		eventName: 'noExternal',
		symbol:  'n',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Moderated Channel',
		eventName: 'moderated',
		symbol:  'm',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Limit Channel Users',
		eventName: 'limit',
		symbol:  'l',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	},
	{
		label: 'Ban',
		eventName: 'ban',
		type: 'command',
		roles: ['op'],
		scopes: ['user']
	},
	{
		label: 'Bans',
		eventName: 'bans',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelDialog']
	}
]);
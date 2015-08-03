'use strict';

import ModeCollection from 'lib/models/ModeCollection';

export default new ModeCollection([
	{
		label: 'Who Is?',
		eventName: 'whois',
		flag:  null,
		type: 'query',
		roles: ['op', 'voice', null],
		scopes: ['userContext']
	},
	{
		label: 'Op',
		eventName: 'op',
		type: 'mode',
		flag:  'o',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'De-Op',
		eventName: 'deop',
		flag:  'o',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Voice',
		eventName: 'voice',
		flag:  'v',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'De-Voice',
		eventName: 'devoice',
		flag:  'v',
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Kick',
		eventName: 'kick',
		flag:  null,
		type: 'command',
		roles: ['op'],
		scopes: ['userContext']
	},
	{
		label: 'Show Channel Modes Dialog',
		eventName: 'showChannelInfo',
		flag:  null,
		type: 'action',
		roles: ['op'],
		scopes: ['channelContext']
	},
	{
		label: 'Private',
		eventName: 'private',
		flag:  'p',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
	{
		label: 'Secret',
		eventName: 'secret',
		flag:  's',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
	{
		label: 'Invite-Only',
		eventName: 'inviteOnly',
		flag:  'i',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
	{
		label: 'Only Ops Set Topic',
		eventName: 'opsSetTopic',
		flag:  't',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
  {
		label: 'No External Messsages',
		eventName: 'noExternal',
		flag:  'n',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
	{
		label: 'Moderated Channel',
		eventName: 'moderated',
		flag:  'm',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag']
	},
	{
		label: 'Limit Channel Users',
		eventName: 'limit',
		flag:  'l',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag'],
		varName: 'limit'
	},
	{
		label: 'Set Channel Key',
		eventName: 'key',
		flag:  'k',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag'],
		varName: 'key'
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
		scopes: ['channelBans']
	}
]);
export default
[
	{
		label: 'Who Is?',
		eventName: 'whois',
		flag:  null,
		type: 'query',
		roles: ['op', 'voice', null],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'Op',
		eventName: 'op',
		type: 'mode',
		flag:  'o',
		isSet: true,
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'De-Op',
		eventName: 'deop',
		flag:  'o',
		isSet: false,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'Voice',
		eventName: 'voice',
		flag:  'v',
		isSet: true,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'De-Voice',
		eventName: 'devoice',
		flag:  'v',
		isSet: false,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
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
		scopes: ['channelFlag', 'channelModeContext']
	},
	{
		label: 'Secret',
		eventName: 'secret',
		flag:  's',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext']
	},
	{
		label: 'Invite-Only',
		eventName: 'inviteOnly',
		flag:  'i',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext']
	},
	{
		label: 'Only Ops Set Topic',
		eventName: 'opsSetTopic',
		flag:  't',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext']
	},
  {
		label: 'No External Messsages',
		eventName: 'noExternal',
		flag:  'n',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext']
	},
	{
		label: 'Moderated Channel',
		eventName: 'moderated',
		flag:  'm',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext']
	},
	{
		label: 'Limit Channel Users',
		eventName: 'limit',
		flag:  'l',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext'],
		paramName: 'limit'
	},
	{
		label: 'Set Channel Key',
		eventName: 'key',
		flag:  'k',
		type: 'mode',
		roles: ['op'],
		scopes: ['channelFlag', 'channelModeContext'],
		paramName: 'key'
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
];
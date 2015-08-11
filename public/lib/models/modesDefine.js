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
		paramName: 'nick',
		isParamAlwaysRequired: true,
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'De-Op',
		eventName: 'deop',
		flag:  'o',
		isSet: false,
		paramName: 'nick',
		isParamAlwaysRequired: true,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'Voice',
		eventName: 'voice',
		flag:  'v',
		isSet: true,
		paramName: 'nick',
		isParamAlwaysRequired: true,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'De-Voice',
		eventName: 'devoice',
		flag:  'v',
		isSet: false,
		paramName: 'nick',
		isParamAlwaysRequired: true,
		type: 'mode',
		roles: ['op'],
		scopes: ['userContext', 'channelFlag']
	},
	{
		label: 'Kick',
		eventName: 'kick',
		flag:  null,
		paramName: 'nick',
		isParamAlwaysRequired: true,
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
		paramName: 'limit',
		scopes: ['channelFlag', 'channelModeContext'],
	},
	{
		label: 'Set Channel Key',
		eventName: 'key',
		flag:  'k',
		type: 'mode',
		roles: ['op'],
		paramName: 'key',
		scopes: ['channelFlag', 'channelModeContext'],
	},
	{
		label: 'Ban',
		eventName: 'ban',
		flag: 'b',
		type: 'mode',
		paramName: 'nick',
		isParamAlwaysRequired: true,
		roles: ['op'],
		scopes: ['userContext', 'channelBan']
	}
];
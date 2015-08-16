'use strict';

import Backbone from 'backbone';
import Moment from 'moment';
import ModeModel from './modeModel';

const commandNumToStrLookup = {
  '001':'RPL_WELCOME',
  '002':'RPL_YOURHOST',
  '003':'RPL_CREATED',
  '004':'RPL_MYINFO',
  '005':'RPL_BOUNCE',
  '006':'RPL_MAPMORE',
  '007':'RPL_MAPEND',
  '008':'RPL_SNOMASK',
  '009':'RPL_STATMEMTOT',
  '010':'RPL_STATMEM',
  '014':'RPL_YOURCOOKIE',
  '200':'RPL_TRACELINK',
  '201':'RPL_TRACECONNECTING',
  '202':'RPL_TRACEHANDSHAKE',
  '203':'RPL_TRACEUNKNOWN',
  '204':'RPL_TRACEOPERATOR',
  '205':'RPL_TRACEUSER',
  '206':'RPL_TRACESERVER',
  '207':'RPL_TRACESERVICE',
  '208':'RPL_TRACENEWTYPE',
  '209':'RPL_TRACECLASS',
  '210':'RPL_TRACERECONNECT',
  '211':'RPL_STATSLINKINFO',
  '212':'RPL_STATSCOMMANDS',
  '213':'RPL_STATSCLINE',
  '214':'RPL_STATSNLINE',
  '215':'RPL_STATSILINE',
  '216':'RPL_STATSKLINE',
  '217':'RPL_STATSQLINE',
  '218':'RPL_STATSYLINE',
  '219':'RPL_ENDOFSTATS',
  '220':'RPL_STATSPLINE',
  '221':'RPL_UMODEIS',
  '222':'RPL_STATSBLINE',
  '223':'RPL_STATSELINE',
  '224':'RPL_STATSFLINE',
  '225':'RPL_STATSDLINE',
  '226':'RPL_STATSCOUNT',
  '227':'RPL_STATSGLINE',
  '231':'RPL_SERVICEINFO',
  '232':'RPL_ENDOFSERVICES',
  '233':'RPL_SERVICE',
  '234':'RPL_SERVLIST',
  '235':'RPL_SERVLISTEND',
  '239':'RPL_STATSIAUTH',
  '240':'RPL_STATSVLINE',
  '241':'RPL_STATSLLINE',
  '242':'RPL_STATSUPTIME',
  '243':'RPL_STATSOLINE',
  '244':'RPL_STATSHLINE',
  '245':'RPL_STATSSLINE',
  '246':'RPL_STATSPING',
  '247':'RPL_STATSBLINE',
  '248':'RPL_STATSDEFINE',
  '249':'RPL_STATSDEBUG',
  '250':'RPL_STATSDLINE',
  '251':'RPL_LUSERCLIENT',
  '252':'RPL_LUSEROP',
  '253':'RPL_LUSERUNKNOWN',
  '254':'RPL_LUSERCHANNELS',
  '255':'RPL_LUSERME',
  '256':'RPL_ADMINME',
  '257':'RPL_ADMINLOC1',
  '258':'RPL_ADMINLOC2',
  '259':'RPL_ADMINEMAIL',
  '261':'RPL_TRACELOG',
  '262':'RPL_TRACEPING',
  '263':'RPL_TRYAGAIN',
  '265':'RPL_LOCALUSERS',
  '266':'RPL_GLOBALUSERS',
  '271':'RPL_SILELIST',
  '272':'RPL_ENDOFSILELIST',
  '274':'RPL_STATSDELTA',
  '275':'RPL_STATSDLINE',
  '280':'RPL_GLIST',
  '281':'RPL_ENDOFGLIST',
  '290':'RPL_HELPHDR',
  '291':'RPL_HELPOP',
  '292':'RPL_HELPTLR',
  '293':'RPL_HELPHLP',
  '294':'RPL_HELPFWD',
  '295':'RPL_HELPIGN',
  '300':'RPL_NONE',
  '301':'RPL_AWAY',
  '302':'RPL_USERHOST',
  '303':'RPL_ISON',
  '304':'RPL_TEXT',
  '305':'RPL_UNAWAY',
  '306':'RPL_NOWAWAY',
  '307':'RPL_WHOISREGNICK',
  '308':'RPL_WHOISADMIN',
  '309':'RPL_WHOISSADMIN',
  '310':'RPL_WHOISSVCMSG',
  '311':'RPL_WHOISUSER',
  '312':'RPL_WHOISSERVER',
  '313':'RPL_WHOISOPERATOR',
  '314':'RPL_WHOWASUSER',
  '315':'RPL_ENDOFWHO',
  '316':'RPL_WHOISCHANOP',
  '317':'RPL_WHOISIDLE',
  '318':'RPL_ENDOFWHOIS',
  '319':'RPL_WHOISCHANNELS',
  '321':'RPL_LISTSTART',
  '322':'RPL_LIST',
  '323':'RPL_LISTEND',
  '324':'RPL_CHANNELMODEIS',
  '325':'RPL_UNIQOPIS',
  '326':'RPL_NOCHANPASS',
  '327':'RPL_CHPASSUNKNOWN',
  '329':'RPL_CREATIONTIME',
  '331':'RPL_NOTOPIC',
  '332':'RPL_TOPIC',
  '333':'RPL_TOPICWHOTIME',
  '334':'RPL_LISTUSAGE',
  '338':'RPL_CHANPASSOK',
  '339':'RPL_BADCHANPASS',
  '341':'RPL_INVITING',
  '342':'RPL_SUMMONING',
  '346':'RPL_INVITELIST',
  '347':'RPL_ENDOFINVITELIST',
  '348':'RPL_EXCEPTLIST',
  '349':'RPL_ENDOFEXCEPTLIST',
  '351':'RPL_VERSION',
  '352':'RPL_WHOREPLY',
  '353':'RPL_NAMREPLY',
  '354':'RPL_WHOSPCRPL',
  '361':'RPL_KILLDONE',
  '362':'RPL_CLOSING',
  '363':'RPL_CLOSEEND',
  '364':'RPL_LINKS',
  '365':'RPL_ENDOFLINKS',
  '366':'RPL_ENDOFNAMES',
  '367':'RPL_BANLIST',
  '368':'RPL_ENDOFBANLIST',
  '369':'RPL_ENDOFWHOWAS',
  '371':'RPL_INFO',
  '372':'RPL_MOTD',
  '373':'RPL_INFOSTART',
  '374':'RPL_ENDOFINFO',
  '375':'RPL_MOTDSTART',
  '376':'RPL_ENDOFMOTD',
  '381':'RPL_YOUREOPER',
  '382':'RPL_REHASHING',
  '383':'RPL_YOURESERVICE',
  '384':'RPL_MYPORTIS',
  '385':'RPL_NOTOPERANYMORE',
  '391':'RPL_TIME',
  '392':'RPL_USERSSTART',
  '393':'RPL_USERS',
  '394':'RPL_ENDOFUSERS',
  '395':'RPL_NOUSERS',
  '401':'ERR_NOSUCHNICK',
  '402':'ERR_NOSUCHSERVER',
  '403':'ERR_NOSUCHCHANNEL',
  '404':'ERR_CANNOTSENDTOCHAN',
  '405':'ERR_TOOMANYCHANNELS',
  '406':'ERR_WASNOSUCHNICK',
  '407':'ERR_TOOMANYTARGETS',
  '408':'ERR_NOSUCHSERVICE',
  '409':'ERR_NOORIGIN',
  '411':'ERR_NORECIPIENT',
  '412':'ERR_NOTEXTTOSEND',
  '413':'ERR_NOTOPLEVEL',
  '414':'ERR_WILDTOPLEVEL',
  '415':'ERR_BADMASK',
  '416':'ERR_QUERYTOOLONG',
  '421':'ERR_UNKNOWNCOMMAND',
  '422':'ERR_NOMOTD',
  '423':'ERR_NOADMININFO',
  '424':'ERR_FILEERROR',
  '429':'ERR_TOOMANYAWAY',
  '431':'ERR_NONICKNAMEGIVEN',
  '432':'ERR_ERRONEUSNICKNAME',
  '433':'ERR_NICKNAMEINUSE',
  '434':'ERR_SERVICENAMEINUSE',
  '435':'ERR_SERVICECONFUSED',
  '436':'ERR_NICKCOLLISION',
  '437':'ERR_BANNICKCHANGE',
  '438':'ERR_NCHANGETOOFAST',
  '439':'ERR_TARGETTOOFAST',
  '440':'ERR_SERVICESDOWN',
  '441':'ERR_USERNOTINCHANNEL',
  '442':'ERR_NOTONCHANNEL',
  '443':'ERR_USERONCHANNEL',
  '444':'ERR_NOLOGIN',
  '445':'ERR_SUMMONDISABLED',
  '446':'ERR_USERSDISABLED',
  '451':'ERR_NOTREGISTERED',
  '452':'ERR_IDCOLLISION',
  '453':'ERR_NICKLOST',
  '455':'ERR_HOSTILENAME',
  '461':'ERR_NEEDMOREPARAMS',
  '462':'ERR_ALREADYREGISTRED',
  '463':'ERR_NOPERMFORHOST',
  '464':'ERR_PASSWDMISMATCH',
  '465':'ERR_YOUREBANNEDCREEP',
  '466':'ERR_YOUWILLBEBANNED',
  '467':'ERR_KEYSET',
  '468':'ERR_ONLYSERVERSCANCHANGE',
  '471':'ERR_CHANNELISFULL',
  '472':'ERR_UNKNOWNMODE',
  '473':'ERR_INVITEONLYCHAN',
  '474':'ERR_BANNEDFROMCHAN',
  '475':'ERR_BADCHANNELKEY',
  '476':'ERR_BADCHANMASK',
  '477':'ERR_NEEDREGGEDNICK',
  '478':'ERR_BANLISTFULL',
  '479':'ERR_BADCHANNAME',
  '481':'ERR_NOPRIVILEGES',
  '482':'ERR_CHANOPRIVSNEEDED',
  '483':'ERR_CANTKILLSERVER',
  '484':'ERR_ISCHANSERVICE',
  '485':'ERR_UNIQOPPRIVSNEEDED',
  '487':'ERR_CHANTOORECENT',
  '488':'ERR_TSLESSCHAN',
  '489':'ERR_VOICENEEDED',
  '491':'ERR_NOOPERHOST',
  '492':'ERR_NOSERVICEHOST',
  '501':'ERR_UMODEUNKNOWNFLAG',
  '502':'ERR_USERSDONTMATCH',
  '503':'ERR_GHOSTEDCLIENT',
  '504':'ERR_LAST_ERR_MSG',
  '511':'ERR_SILELISTFULL',
  '512':'ERR_TOOMANYWATCH',
  '513':'ERR_BADPING',
  '514':'ERR_TOOMANYDCC',
  '521':'ERR_LISTSYNTAX',
  '522':'ERR_WHOSYNTAX',
  '523':'ERR_WHOLIMEXCEED',
  '600':'RPL_LOGON',
  '601':'RPL_LOGOFF',
  '602':'RPL_WATCHOFF',
  '603':'RPL_WATCHSTAT',
  '604':'RPL_NOWON',
  '605':'RPL_NOWOFF',
  '606':'RPL_WATCHLIST',
  '607':'RPL_ENDOFWATCHLIST',
  '617':'RPL_DCCSTATUS',
  '618':'RPL_DCCLIST',
  '619':'RPL_ENDOFDCCLIST',
  '620':'RPL_DCCINFO',
  '999':'ERR_NUMERIC_ERR'
};

export default Backbone.Model.extend({
  initialize(){
    this.set('timestamp', new Date());
  },
	defaults:{
    raw: null,
    channel: null,
    type: null,
    command: null,
    content: null,
    nick: null,
    timestamp: null,
    parsedMessage: null
	},
  //this takes a /command from the input and tries to turn it into a raw command and then parse that raw command.
  createCommand(command, content){
    var raw = null;
    switch(command.toUpperCase()){
      case 'TOPIC':
        var channel = content.substring(0,content.indexOf(' '));
        var topic = content.substring(content.indexOf(' ')+1);
        raw = command+' '+channel+' :'+topic;
        break;
      default:
        raw = command+' '+content;
        break;
    }
    this.set('raw', raw);
    this.parse(raw);
  },
  parse(){
    var message = this.parseRaw(this.get('raw'));
    //these must be done in this order.
    this.set('type', 'TYPE_'+message.command);
    this.set('command', this._parseCommand(message) );
    this.set('nick', this._parseNick(message) );
    this.set('channel', this._parseChannel(message) );
    this.set('content', this._parseContent(message) );
    this.set('timestamp', new Date());
    this.set('parsedMessage', message);
    return message;
  },
  parseRaw(data) {
      var message = {
          raw: data,
          tags: {},
          prefix: null,
          command: null,
          parsed: null,
          params: []
      }

      // strip trailing newlines
      if (data.charAt(data.length-1) == '\n') {
        data = data.slice(0, -1)
        message.raw = data
      }

      // position and nextspace are used by the parser as a reference.
      var position = 0
      var nextspace = 0

      // The first thing we check for is IRCv3.2 message tags.
      // http://ircv3.atheme.org/specification/message-tags-3.2

      if (data.charCodeAt(0) === 64) {
          var nextspace = data.indexOf(' ')

          if (nextspace === -1) {
              // Malformed IRC message.
              return null
          }

          // Tags are split by a semi colon.
          var rawTags = data.slice(1, nextspace).split(';')

          for (var i = 0; i < rawTags.length; i++) {
              // Tags delimited by an equals sign are key=value tags.
              // If there's no equals, we assign the tag a value of true.
              var tag = rawTags[i]
              var pair = tag.split('=')
              message.tags[pair[0]] = pair[1] || true
          }

          position = nextspace + 1
      }

      // Skip any trailing whitespace.
      while (data.charCodeAt(position) === 32) {
          position++
      }

      // Extract the message's prefix if present. Prefixes are prepended
      // with a colon.

      if (data.charCodeAt(position) === 58) {
          nextspace = data.indexOf(' ', position)

          // If there's nothing after the prefix, deem this message to be
          // malformed.
          if (nextspace === -1) {
              // Malformed IRC message.
              return null
          }

          message.prefix = data.slice(position + 1, nextspace)
          message.parsed = this.parseRawPrefix(message.prefix)

          position = nextspace + 1

          // Skip any trailing whitespace.
          while (data.charCodeAt(position) === 32) {
              position++
          }
      }

      nextspace = data.indexOf(' ', position)

      // If there's no more whitespace left, extract everything from the
      // current position to the end of the string as the command.
      if (nextspace === -1) {
          if (data.length > position) {
              message.command = data.slice(position)
              return message
          }

          return null
      }

      // Else, the command is the current position up to the next space. After
      // that, we expect some parameters.
      message.command = data.slice(position, nextspace)

      position = nextspace + 1

      // Skip any trailing whitespace.
      while (data.charCodeAt(position) === 32) {
          position++
      }

      while (position < data.length) {
          nextspace = data.indexOf(' ', position)

          // If the character is a colon, we've got a trailing parameter.
          // At this point, there are no extra params, so we push everything
          // from after the colon to the end of the string, to the params array
          // and break out of the loop.
          if (data.charCodeAt(position) === 58) {
              message.params.push(data.slice(position + 1))
              break
          }

          // If we still have some whitespace...
          if (nextspace !== -1) {
              // Push whatever's between the current position and the next
              // space to the params array.
              message.params.push(data.slice(position, nextspace))
              position = nextspace + 1

              // Skip any trailing whitespace and continue looping.
              while (data.charCodeAt(position) === 32) {
                  position++
              }

              continue
          }

          // If we don't have any more whitespace and the param isn't trailing,
          // push everything remaining to the params array.
          if (nextspace === -1) {
              message.params.push(data.slice(position))
              break
          }
      }
      return message
  },
  parseRawPrefix(prefix) {
      if (!prefix || prefix.length === 0) {
          return null
      }

      var dpos = prefix.indexOf('.') + 1
      var upos = prefix.indexOf('!') + 1
      var hpos = prefix.indexOf('@', upos) + 1

      if (upos === 1 || hpos === 1) {
          return null
      }

      var result = {}
      result.raw = prefix
      result.isServer = false
      result.nick = null
      result.user = null
      result.host = null

      if (upos > 0) {
          result.nick = prefix.slice(0, upos - 1)
          if (hpos > 0) {
              result.user = prefix.slice(upos, hpos - 1)
              result.host = prefix.slice(hpos)
          } else {
              result.user = prefix.slice(upos)
          }
      } else if (hpos > 0) {
          result.nick = prefix.slice(0, hpos - 1)
          result.host = prefix.slice(hpos)
      } else if (dpos > 0) {
          result.host = prefix
          result.isServer = true
      } else {
          result.nick = prefix
      }

      return result
  },
  _parseCommand(message){
    var command = message.command.toUpperCase();
    if(typeof commandNumToStrLookup[message.command] !== 'undefined'){
      command = commandNumToStrLookup[message.command].toUpperCase();
    }
    return command.replace(/(\r\n|\n|\r)/gm, '');
  },
  _parseNick(message){
    if(message.parsed && typeof message.parsed.nick === 'string'){
      return message.parsed.nick.replace(/(\r\n|\n|\r)/gm, '');
    }else{
      switch(this.get('command')){
        case 'RPL_AWAY':
          return message.params[1].replace(/(\r\n|\n|\r)/gm, '');
        case 'RPL_WHOREPLY':
          return message.params[5].replace(/(\r\n|\n|\r)/gm, '');
        default:
          return '';
      }
    }
  },
  _parseChannel(message){
    switch(this.get('command')){
      case 'JOIN':
      case 'PART':
      case 'PRIVMSG':
      case 'TOPIC':
      case 'MODE':
      case 'KICK':
        return message.params[0].replace(/(\r\n|\n|\r)/gm, '');
      case 'QUIT':
      case 'NICK':
        return null;
      case 'RPL_TOPIC':
      case 'RPL_NOTOPIC':
      case 'RPL_CHANNELMODEIS':
      case 'RPL_WHOREPLY':
      case 'RPL_BANLIST':
      case 'ERR_CANNOTSENDTOCHAN':
      case 'ERR_BADCHANNELKEY':
        return message.params[1].replace(/(\r\n|\n|\r)/gm, '');
      case 'RPL_NAMREPLY':
        return message.params[2].replace(/(\r\n|\n|\r)/gm, '');
      default:
        return 'server';
    }
  },
  _parseContent(message){
    switch(this.get('command')){
      case 'JOIN':
        return ' * '+this.get('nick')+' has joined '+this.get('channel');
      case 'PART':
        return ' * '+this.get('nick')+' has left '+this.get('channel');
      case 'PRIVMSG':
      case 'TOPIC':
        return message.params[1];
      case 'QUIT':
        return ' * '+this.get('nick')+' has quit('+message.params[0].replace(/(\r\n|\n|\r)/gm, '')+').';
      case 'MODE':
      case 'RPL_CHANNELMODEIS':
        this.set('modes', ModeModel.parseModes(message));
        var isAwayMode = false;
        var modesStr = '';
        var params = [];
        for(let modeModel of this.get('modes')){
          if(modeModel.get('flag')=='a'){
            isAwayMode = modeModel;
          }else{
            modesStr += modeModel.get('isSet')?'+':'-';
            modesStr += modeModel.get('flag');
            if(modeModel.get('param')){
              params.push(modeModel.get('param'));
            }
          }
        }
        var content =  ' * '+this.get('nick')+' sets mode for '+this.get('channel')+' '+modesStr+' '+params.join(' ');
        if(isAwayMode){
          if(isAwayMode.get('isSet')){
            content = ' * '+this.get('nick')+' is away.';
          }else{
            content = ' * '+this.get('nick')+' is back.';
          }
        }
        return content;
      case 'RPL_AWAY':
        return ' * '+this.get('nick')+' is away.';
      case 'RPL_NOWAWAY':
        return ' * You are now marked as away.';
      case 'RPL_UNAWAY':
        return ' * You are no longer marked as away.';
      case 'RPL_WHOREPLY':
        this.set('userMode', message.params[6].replace(/(\r\n|\n|\r)/gm, ''))
        return this.get('command') +' : '+ message.params.join(' ');
      case 'RPL_BANLIST':
        var mode = new ModeModel({
          flag: 'b',
          eventName: 'ban',
          isSet: true,
          param: message.params[2].replace(/(\r\n|\n|\r)/gm, '')
        });
        this.set('modes', [mode]);
        return ' * Ban Mask';
      case 'KICK':
        this.set('extra', message.params[1].replace(/(\r\n|\n|\r)/gm, '') );
        return ' * '+this.get('extra')+' was kicked from '+this.get('channel')+
          ' by '+this.get('nick')+'. (' +message.params[2]+')';
      case 'NICK':
        this.set('extra', message.params[0].replace(/(\r\n|\n|\r)/gm, '') );
        return ' * '+this.get('nick')+' is now known as '+this.get('extra');
      case 'RPL_TOPIC':
      case 'RPL_NOTOPIC':
        return message.params[2];
      case 'RPL_NAMREPLY':
        return message.params[3];
      case 'RPL_WHOISUSER':
        var content = message.params[1]+' is '+message.params[2]+'@';
        if(message.params[3] != '*'){
          content += message.params[3];
        }
        content += ' ('+message.params.slice(-1)[0]+')';
        return content;
      case 'RPL_WHOISSERVER':
        return  message.params[1]+' using '+message.params[2]+' '+message.params[3];
      case 'RPL_WHOISOPERATOR':
      case 'RPL_WHOISIDLE':
        var idleTimeStr = moment.duration(parseInt(message.params[2]), 'seconds').humanize();
        var signonTimeStr = moment(parseInt(message.params[3])*1000).format('dddd, MMMM Do YYYY, h:mm:ss a');
        return message.params[1]+' has been idle '+idleTimeStr+', signed on at '+signonTimeStr;
      case 'RPL_WHOISCHANNELS':
        return  message.params[1]+' on '+message.params[2];
      case 'ERR_CANNOTSENDTOCHAN':
        return 'Cannot Send To Channel';
      case 'ERR_BANNEDFROMCHAN':
        this.set('extra', message.params[1].replace(/(\r\n|\n|\r)/gm, '') );
        return message.params[1]+': '+message.params[2];
      default:
        return this.get('command') +' : '+ message.params.join(' ');
    }
  },
   //generates a raw command to send from the model properties
  toString(){
    switch(this.get('command')){
      case 'AWAY':
        var awayStr = (this.get('message'))?':'+this.get('message'):'';
        return 'AWAY '+awayStr;
      case 'JOIN':
        var keyStr = '';
        if(this.get('key')){
          keyStr = ' '+this.get('key');
        }
        return 'JOIN '+this.get('channel')+keyStr;
      case 'NICK':
        return 'NICK '+this.get('nick');
      case 'PART':
        return 'PART '+this.get('channel');
      case 'PONG':
        return 'PONG '+this.get('extra');
      case 'PRIVMSG':
        return 'PRIVMSG '+this.get('channel')+' :'+this.get('content');
        break;
      case 'QUIT':
        return 'QUIT';
      case 'USER':
        return 'USER '+this.get('extra');
      case 'RAW':
        return this.get('content');
      case 'TOPIC':
        return 'TOPIC '+this.get('channel')+' :'+this.get('content');
      case 'WHOIS':
        return 'WHOIS '+this.get('extra');
      case 'MODE':
        var modeSetArr = [];
        var modeUnSetArr = [];
        var modeInfoArr = [];
        var params = [];
        if(this.get('modes')){
          for(let modeModel of this.get('modes')){
            if(modeModel.get('isSet') === true){
              modeSetArr.push(modeModel.get('flag'));
            }else if(modeModel.get('isSet') === false){
              modeUnSetArr.push(modeModel.get('flag'));
            }else{
              modeInfoArr.push(modeModel.get('flag'));
            }
            if(modeModel.get('isSet') && modeModel.get('paramName')){
              params.push(modeModel.get('param'));
            }else if(modeModel.get('isParamAlwaysRequired')){
              params.push(modeModel.get('param'));
            }
          }
        }
        var modesStr = '';
        if(modeInfoArr.length > 0){
          modesStr += modeInfoArr.join('');
        }
        if(modeSetArr.length > 0){
          modesStr += '+'+modeSetArr.join('');
        }
        if(modeUnSetArr.length > 0){
          modesStr += '-'+modeUnSetArr.join('');
        }
        return 'MODE '+this.get('channel')+' '+modesStr+' '+params.join(' ');
      case 'KICK':
        return 'KICK '+this.get('channel')+' '+this.get('extra')+' '+this.get('content');
      case 'WHO':
        return 'WHO '+this.get('channel');
      default:
        return '';
        break;
    }
  }
});
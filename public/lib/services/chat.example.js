var conn;
var nickname;
var channel = "#general";

$(document).ready(function() {
    if (window["WebSocket"]) {
        conn = new WebSocket("ws://dazed.ef.net:8080/ws");
        nickname = "Guest" + Math.floor(Math.random() * 1001)

        conn.addEventListener("open", function(event) {
            conn.send("USER webchat user dazed.ef.net :WebChat User")
            sendNick(nickname);
        });

        conn.addEventListener("close", function(event) {
            appendLog($("<div><b>Connection closed.</b></div>"))
        });

        conn.addEventListener("message", function(event) {
            message = parse(event.data)
            if (message.command == "433") {
                nickname = "Guest" + Math.floor(Math.random() * 1001)
                sendNick(nickname);
            }

            if (message.command == "001") {
                conn.send("JOIN " + channel)
            }

            if (message.command == "JOIN" && message.parsed.nick != nickname) {
                appendLog($("<div/>").text("[" + message.params[0] + "] " + message.parsed.nick + " has joined the channel."))
            }

            if (message.command == "PART" && message.parsed.nick != nickname) {
                appendLog($("<div/>").text("[" + message.params[0] + "] " + + message.parsed.nick + " has left the channel."))
            }

            if (message.command == "QUIT" && message.parsed.nick != nickname) {
                appendLog($("<div/>").text("[" + message.params[0] + "] " + message.parsed.nick + " has disconnected."))
            }

            if (message.command == "PING") {
                conn.send("PONG " + message.params)
            }

            if (message.command == "PRIVMSG") {
                appendLog($("<div/>").text("[" + message.params[0] + "] " + "<" + message.parsed.nick + "> " + message.params[1]))
            }
            console.log(event.data);
            console.log(message);
            //  appendLog($("<div/>").text(event.data))
        });
    } else {
        appendLog($("<div><b>Your browser does not support WebSockets.</b></div>"))
    }
});

$("#myform").submit(function(event) {
    event.preventDefault();
    console.log("event submit")
    return false
});


function sendNick(nickname) {
    conn.send("NICK " + nickname)
}

function formSubmit() {
    var msg = $("#message-input");
    var log = $("#wrap");

    if (!conn) {
        return false;
    }

    if (!msg.val()) {
        return false;
    }

    conn.send("PRIVMSG " + channel + " :" + msg.val());
    appendLog($("<div/>").text("[" + channel + "] " + "<" + nickname + "> " + msg.val()));
    msg.val("");
    return false
};

function appendLog(msg) {
    var messages = $(".messages");
    var d = messages[0]

    var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
    msg.appendTo(messages)

    if (doScroll) {
        d.scrollTop = d.scrollHeight - d.clientHeight;
    }
}

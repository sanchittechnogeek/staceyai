var socketio = require('socket.io');
var db = require('./old_chat_db');
var io;
// maps socket.id to user's nickname
var nicknames = {};
// list of socket ids
var clients = [];
var names_used = [];

exports.listen = function(server){
  io = socketio.listen(server);
  io.set('log level', 2);
  io.sockets.on('connection', function(socket){
    initialize_connection(socket);
    handle_choosing_nicknames(socket);
    handle_client_disconnections(socket);
    handle_message_broadcasting(socket);
    handle_private_messaging(socket);
  });
}

function initialize_connection(socket){
  show_active_users(socket);
  //show_old_messages(socket);
}

function show_active_users(socket){
  var active_names = [];
  var users_in_room = io.sockets.clients();
  for (var index in users_in_room){
    var user_socket_id = users_in_room[index].id;
    if (user_socket_id !== socket.id && nicknames[user_socket_id]){
      var name = nicknames[user_socket_id];
      active_names.push({id: names_used.indexOf(name), nick: name});
    }
  }
  socket.emit('names', active_names);
}

/*
function show_old_messages(socket){
  db.get_old_messages(5, function(err, docs){
    socket.emit('load old msgs', docs);
  });
}
*/

function handle_choosing_nicknames(socket){
  socket.on('choose nickname', function(nick, cb) {
    if (names_used.indexOf(nick) !== -1) {
      cb('That name is already taken!  Please choose another one.');
      return;
    }
    var ind = names_used.push(nick) - 1;
    clients[ind] = socket;
    nicknames[socket.id] = nick;
    cb(null);
    io.sockets.emit('new user', {id: ind, nick: nick});
  });
}

function handle_message_broadcasting(socket){
  socket.on('message', function(msg){
    var nick = nicknames[socket.id];
    /*
    db.save_message({nick: nick, msg: msg},
    */
     //function(err){
      //if(err) throw err;
      io.sockets.emit('message', {nick: nick, msg: msg});
    //});
  });
}

function handle_private_messaging(socket){
  socket.on('private message', function(data){
    var from = nicknames[socket.id];
    clients[data.userToPM].emit('private message', {from: from, msg: data.msg});
  });
}

function handle_client_disconnections(socket){
  socket.on('disconnect', function(){
    var ind = names_used.indexOf(nicknames[socket.id]);
    delete names_used[ind];
    delete clients[ind];
    delete nicknames[socket.id];
    io.sockets.emit('user disconnect', ind);
  });
}
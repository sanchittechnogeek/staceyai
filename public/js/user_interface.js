$(function(){
	var socket = io.connect();
	// id of user that is being private messaged
	var userToPM = undefined;

	$('#choose-nickname').submit(function(e){
		e.preventDefault();
		var nick = $('#nickname').val();
		socket.emit('choose nickname', nick, function(err){
			if (err) {
				$('#nick-error').text(err);
				$('#nickname').val('');
			} else {
				$('#nickname-container').hide();
				$('#chat-container').show();
			}
		});
	});

	socket.on('names', function(users) {
		display_Users(users);
	});

	socket.on('new user', function(user) {
		display_Users([user]);
	});

	function display_Users(users){
		var html = '';
		for (var i = 0; i < users.length; i++) {
			html += '<div class="user" id="user' + users[i].id + '">' + users[i].nick + '</span>';
		}
		$('#users').append(html);
	    $('.user').click(function(e){
	    	if (!userToPM) {
	    		$('#pm-col').show();
	    	}
	    	userToPM = $(this).attr('id').substring(4);
	    	$('#user-to-pm').html('<h2>' + $(this).text() + '</h2>');
	    });
	}

	socket.on('user disconnect', function(id){
		console.log(id);
		$('#user'+id).remove();
	});

    $('#send-message').submit(function(e){
        e.preventDefault();
        var msg = $('#new-message').val();
        socket.emit('message', msg);
        $('#new-message').val('');
    });

    socket.on('message', function(data){
    	display_message(data.msg, data.nick)
    });
/*
    socket.on('load old msgs', function(docs){
    	for (var i = docs.length-1; i >= 0; i--) {
    		display_message(docs[i].msg, docs[i].nick);
    	}
    });
*/
    function display_message(msg, nick){
    	var html = "<span class='msg'><strong>" + nick + ":</strong> " + msg;
    	$('#chat').append(html);
    }

    $('#send-pm').submit(function(e){
    	e.preventDefault();
    	socket.emit('private message', {msg: $('#new-pm').val(), userToPM: userToPM});
    	$('#new-pm').val('');
    });

    socket.on('private message', function(data){
    	var html = "<span class='pMsg'><strong>" + data.from + ":</strong> " + data.msg;
    	$('#chat').append(html);
    });

});
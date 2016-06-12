var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to mongodb!');
	}
});

var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

exports.get_old_messages = function(limit, cb){
	var query = Chat.find({});
	query.sort('-created').limit(limit).exec(function(err, docs){
		cb(err, docs);
	});
}

exports.save_message = function(data, cb){
	var new_message = new Chat({msg: data.msg, nick: data.nick});
	new_message.save(function(err){
		cb(err);
	});
};
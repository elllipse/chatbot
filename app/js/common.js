(function($){

$(function() {

	var $msgInput = $('#msg-input');
	var $sendButton = $('#send-button');
	var $chatDisplay = $('#chat-display');
	var enterSendCheck = $('#enter-send')[0];

	//Database json
	var db = null;
	getData();

	var userName = /*prompt("Enter your name pls", "") ||*/ "You"; 

	$sendButton.on("click", sendButtonClick);
	$msgInput.on("keypress", inputKeypress);

	function inputKeypress(e) {
		if (enterSendCheck.checked) {
			if (e.which === 13) {
				sendButtonClick();
			}	
		}
	}

	function sendButtonClick() {
		var isSended = postMsg(userName, getMsg());
		$msgInput.focus();

		if (isSended) {
			aiReact();
		}
	}

	function getTime() {
		var currentTime = new Date();
		var currentHours = get24Styled( currentTime.getHours() );
		var currentMinutes = get24Styled( currentTime.getMinutes() );

		function get24Styled(time) {
			return time <= 9 ? '0' + time : time;
		}

		return {
			hours : currentHours,
			minutes : currentMinutes,
			fullTime : function() {
				return this.hours + ":" + this.minutes;
			}
		}
	}

	function getMsg() {
		var msg = $msgInput.val();
		$msgInput.val('');

		if (!msg) return;
		return msg;
	}

	function postMsg(user, text) {

		if (!text) {return false;}//No sended msg. Return false for avoid AI react

		var $newPost = $('<p class="user-msg">' +
							'<span class="post-time">'+ '[' + getTime().fullTime() + ']' +'</span>' +
							'<span class="user-name">'+ user + ':' +'</span>'+
							'<span class="user-text"></span>'+
						'</p>');

		$newPost.children('.user-text').text(text);		
		$chatDisplay.append($newPost);

		//scroll window to last message
		var scrollValue = $chatDisplay[0].scrollHeight;
		$chatDisplay.scrollTop(scrollValue);
		//Msg sended. Return true for AI react
		return true;
	}

	function aiReact() {
		var $lastMsg = $chatDisplay.find('.user-msg:last-child');
		var lastMsgText = $lastMsg.find('.user-text').text();

		var answer = aiResponse(lastMsgText);

		setTimeout(function() {
			if (answer) {postMsg('Bot', answer);}
			else {postMsg('Bot', 'write something else...');}
			console.log(allWords);
		}, 1000);
	}

	function aiResponse(question) {
		var longestKey = '';
		var answer;
		var answerIndex = 0;

		for (var key in db) {
			var index = question.indexOf(key);
			if ( index > -1 && key.length > longestKey.length) {
				longestKey = key;
			}
		}

		if (longestKey) {
			answer = db[longestKey];
			answerIndex = Math.ceil( Math.random() * Object.keys(db[longestKey]).length );
			return answer[answerIndex];
		};
	}

	function getData() {
		$.ajax({
			url: '../api/data.json',
			type: 'GET',
			data: {param1: 'value1'},
			success: function(data) {
				db = data;
			}
		})
	}


})	

})(jQuery);


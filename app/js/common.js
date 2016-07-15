(function($){

$(function() {

	var $msgInput = $('#msg-input');
	var $sendButton = $('#send-button');
	var $chatDisplay = $('#chat-display');
	var enterSendCheck = $('#enter-send')[0];

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
		postMsg(userName, getMsg());
		$msgInput.focus();
		aiReact();
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

		return msg;
	}

	function postMsg(user, text) {

		if (!text) {return;}

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
	}

	function aiReact() {
		var $lastMsg = $chatDisplay.find('.user-msg:last-child');
		var lastMsgText = $lastMsg.find('.user-text').text();
		
		setTimeout(function() {
			postMsg('Bot', lastMsgText + ' HaHahahahHA');
		}, 2000);
	}


})	

})(jQuery);


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
				postMsg();
			}	
		}
	}

	function sendButtonClick() {
		postMsg();
		$msgInput.focus();
	};

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

	function postMsg() {
		var msg = $msgInput.val();
		$msgInput.val('');

		if (!msg) {	return;}

		var newPost = '<p class="user-msg">' +
		'<span class="post-time">'+ '[' + getTime().fullTime() + ']' +'</span>' +
		'<span class="user-name">'+ userName + ':' +'</span>'+
		msg +
		'</p>';
		$chatDisplay.append(newPost);

		//scroll window to last message
		var scrollValue = $chatDisplay[0].scrollHeight;
		$chatDisplay.scrollTop(scrollValue);
	}


})	

})(jQuery);


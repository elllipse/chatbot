(function($){

$(function() {

	var $msgInput = $('#msg-input');
	var $sendButton = $('#send-button');
	var $chatDisplay = $('#chat-display');

	var userName = /*prompt("Enter your name pls", "") ||*/ "You"; 

	$sendButton.on("click", sendButtonClick);

	function sendButtonClick() {
		var msg = $msgInput.val();
		$msgInput.val('');
		if (msg) {
			postMsg(msg);
		}
		
	};

	function postMsg(msg) {
		var newPost = '<p class="user-msg"><span class="user-name">'+ userName + ': ' +'</span>'+ msg +'</p>';
		$chatDisplay.append(newPost);
		$msgInput.focus();
	}


})	

})(jQuery);


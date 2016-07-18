(function($){

$(function() {

	var $msgInput    = $('#msg-input'),
		$sendButton  = $('#send-button'),
		$chatDisplay = $('#chat-display'),
		sendOnEnter  = $('#enter-send')[0];

	//Settings
	var db = null,
		lastAnswerObj,
		positiveAnswer = 'do it,yes,yep,ofcourse,okay,okey,definitely,certainly,do',
		negativeAnswer = "no,not,dont,don't",
		noAnswer = ["Sorry, i dont understand","What?","What are you typing about?","Cant answer you","I dunno"];
	getData();

	var userName = "You"; 

	$sendButton.on("click", sendButtonClick);
	$msgInput.on("keypress", inputKeypress);

	function inputKeypress(e) {
		if (sendOnEnter.checked) {
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
		var currentTime    = new Date(),
			currentHours   = get24Styled( currentTime.getHours() ),
			currentMinutes = get24Styled( currentTime.getMinutes() );

		function get24Styled(time) {
			return time <= 9 ? '0' + time : time;
		}

		return {
			hours    : currentHours,
			minutes  : currentMinutes,
			fullTime : function() {
				return this.hours + ":" + this.minutes;
			}
		}
	}

	function getMsg() {
		var msg = $msgInput.val().trim();
		$msgInput.val('');

		if (!msg) return;
		return msg;
	}

	function postMsg(user, text) {

		if (!text) {return false;}//No sended msg. Return false for avoid AI react
		var textScript;

		var $newPost = $('<p>' +
							'<span class="post-time">'+ '[' + getTime().fullTime() + ']' +'</span>' +
							'<span class="user-name">'+ user + ':' +'</span>'+
							'<span class="user-text"></span>'+
						'</p>');

		if (user === 'Bot') {
			if (text.indexOf('*es*') > -1 ) {
				textScript = text.slice(4);

				text = eval(textScript);
			}
			$newPost.children('.user-text').html(text);
			$newPost.addClass('bot-msg');
		} else {
			$newPost.children('.user-text').text(text);
			$newPost.addClass('user-msg');	
		}
	
		$chatDisplay.append($newPost);

		//scroll window to last message
		var scrollValue = $chatDisplay[0].scrollHeight;
		$chatDisplay.scrollTop(scrollValue);
		//Msg sended. Return true for AI react
		return true;
	}

	function aiReact() {
		//get last user msg text
		var $lastMsg    = $chatDisplay.find('.user-msg:last-child'),
			lastMsgText = $lastMsg.find('.user-text').text(),
			answer      = aiResponse( lastMsgText.toLowerCase() );

		//post ai answer after delay
		setTimeout(function() {
			if (answer) {postMsg('Bot', answer);}
			else {postMsg('Bot', 'write something else...');}
		}, 1000);
	}

	function aiResponse(query) {
		//if user positive answer after bot question
		if (positiveAnswer.indexOf(query) > -1 && lastAnswerObj && lastAnswerObj.extAnsw !== 'undefined') {
			var extendedAnswer = lastAnswerObj.extAnsw;
			lastAnswerObj = null; //clear object after first positive answer
			return extendedAnswer;
		}
		//if user negative answer
		if (negativeAnswer.indexOf(query) > -1) {
			return 'as you wish!';
		}
		
		var longestPhrase = '',
			answers,
			currentAnswArr,
			answerIndex;

		//find most appropriate query
		for (var phrase in db) {
			var index = query.indexOf(phrase);
			if ( index > -1 && phrase.length > longestPhrase.length) {
				longestPhrase = phrase;
			}
		}

		if (longestPhrase) {
			answers = db[longestPhrase];
			answerIndex = Math.ceil( Math.random() * Object.keys(answers).length );
			currentAnswArr = answers[answerIndex].split('->');
			lastAnswerObj = {
				phrase  : longestPhrase,
				version : currentAnswArr[0],
				extAnsw : currentAnswArr[1]
			};
			return lastAnswerObj.version;
		};

		//if no answer found
		return noAnswer[Math.floor( Math.random() * (noAnswer.length + 1) )];
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


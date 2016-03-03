<style>
.modal-backdrop.fade.in
{
	z-index:0 !important;
}
</style>

<script>

function timeout_init() {
   
	
	setTimeout('sessionTimeoutCounter_trigger()', 600000);
	
	
    
}

function sessionTimeoutCounter_trigger() {

	bootbox.alert($("#sessionOut").html(), function(result) {

		
			window.location="../home/logout.wilas";
	});
		
}

function constructString(strMessage) {
	var strMsg = "<ul>";
	if (strMessage instanceof Array) {
		for (var intLoop = 0; intLoop < strMessage.length; intLoop++) {
			strMsg += "<li>" + strMessage[intLoop] + "</li>";
		}
	} else {
		strMsg += "<li>" + strMessage + "</li>";
	}

	strMsg += "</ul>";

	return strMsg;
}

var gritter_id;


	function alertError(strMessage) {
		if (strMessage == null)
			return;

		var constructedMsg = constructString(strMessage);
		if (gritter_id != undefined) {
			$.gritter.remove(gritter_id);
		}

		gritter_id = $.gritter.add({
			// (string | mandatory) the heading of the notification
			title : 'Error',
			// (string | mandatory) the text inside the notification
			text : constructedMsg,
			image : '${ WEBAPPS }/img/alert.gif',
			sticky : true,
			class_name : "gritter-error-box"
		});
	}


	window.alertError = alertError;

	function alertNotification(strMessage) {
		if (strMessage == null)
			return;

		var constructedMsg = constructString(strMessage);

		$.gritter.add({
			//	(string | mandatory) the heading of the notification
			title : 'Notification',
			//	(string | mandatory) the text inside the notification
			text : constructedMsg,
			//	image: '${ WEBAPPS }/img/alert.gif',
			class_name : "gritter"
		});
	}

	window.alertNotification = alertNotification;

</script>


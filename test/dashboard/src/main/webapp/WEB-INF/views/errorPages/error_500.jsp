<%@ include file="../include/import.jsp"%>
<style>

html, body {
	width:100%;
	
}

#error_img {
	width:60%;
	margin-left:auto;
	margin-right:auto;
}

#error_img img{
	width:100%;
	margin-top:5%;
	margin-bottom:5%;
}

#error_text {
	text-align:center;
	width:80%;
	margin-left:auto;
	margin-right:auto;
	font-size:16px;
	font-weight:bold;
	font-family:Arial, Verdana, sans-serif;
	color:#5c5c5c;
}

@media all and (max-width: 900px){
	#error_img {
		width:80%;
	}
	#error_text {
		width:90%;
	}
}

</style>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title></title>
<link rel="icon" type="image/ico"  href="${ WEBAPPS }/img/favicon.ico">
</head>
<body>

<div id="error_img">
	<img src="${ WEBAPPS }/img/500.png"/>
</div>

<div id="error_text">
	<span style="color:#14648c">Something has gone wrong.</span><br>
	We're experiencing an Internal Server problem. Please try back later.
</div>
</body>

</html>
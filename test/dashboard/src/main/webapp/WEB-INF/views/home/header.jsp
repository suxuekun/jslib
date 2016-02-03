<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html lang="en">
<head>
<link rel="icon" type="image/png" href="${ WEBAPPS }/img/favicon.ico">


<%@ include file="../include/style.jsp"%>
<%@ include file="../include/script.jsp"%>

</head>

<body data-color="grey" class="flat">
	<div id="wrapper" style="min-height: 768px;">
		<div id="header">
			<h1>
				<a href="#">Wilas CMS</a>
			</h1>
			<a id="menu-trigger" href="#"><i class="fa fa-bars"></i></a>
		</div>
		<div id="user-nav">
			<ul class="btn-group">
				<li class="btn"><a title="" href="#"><i class="fa fa-user"></i>
						<span class="text"><spring:message code="header.profile" /> [<sec:authentication property="principal.username" />]
					</span></a></li>
				<li class="btn"><a title="" href="${ WEBAPPS }/home/logout.wilas"><i class="fa fa-share"></i> <span class="text"><spring:message code="menu.logout" /></span></a></li>
			</ul>
		</div>
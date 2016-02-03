<%@ include file="../include/import.jsp"%>
<%@ include file="../include/timeout_alert.jsp"%>

<div id="sidebar">
	<ul>
		<li <% if( String.valueOf(request.getAttribute( "MYPAGE" ) ).indexOf("main")>=0){ %> class="active" <%}else { %>  <% }  %> >
			<a href="${ WEBAPPS }/main.wilas"><i class="fa fa-home"></i><span><spring:message code="menu.dashboard" /></span><i class="arrow fa fa-chevron-right"></i></a>
		</li>
		<li><a href="/am"><i class="fa fa-group"></i><span><spring:message code="menu.am" /></span></a></li>
		<li>
			<a href="/vm"><i class="fa fa-wifi"></i><span><spring:message code="menu.vm" /></span></a>
		</li>
		<li>
		<a href="/cp/captiveportal/index.wilas"><i class="fa fa-wifi"></i><span><spring:message code="menu.cp" /></span></a>
		</li>
		
		<li><a href="/bi"><i class="fa fa-road"></i><span><span><spring:message code="menu.bi" /></span></a></li>
		<li><a href="/gf"><i class="fa fa-anchor"></i><span><span><spring:message code="menu.gf" /></span></a></li>
		<li><a href="${ WEBAPPS }/home/logout.wilas"><i class="fa fa-share"></i><span><spring:message code="menu.logout" /></span></a></li>
	</ul>

</div>

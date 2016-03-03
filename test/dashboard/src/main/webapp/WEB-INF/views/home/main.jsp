<%@ include file="../include/import.jsp"%>
<%@ include file="header.jsp"%>
<jsp:include page="../home/leftnav.jsp" />
<div id="content" ng-app='myApp'>
	<div id="content-header">
		<h1><spring:message code="title.main.big" /></h1>
		<div class="btn-group">
			<sec:authorize access="hasAnyRole('ROLE_WS_ROOT_ADMIN')">
				<a id="add-news-btn" class="btn btn-large tip-bottom" title="<spring:message code="tip.news" />"><i class="fa fa-envelope"></i></a>
			</sec:authorize>
			<sec:authorize access="hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')">
				<a id="add-notfication-btn" class="btn btn-large tip-bottom" title="<spring:message code="tip.notification" />"><i class="fa fa-bell"></i></a>
			</sec:authorize>
		</div>
	</div>
	<div id="breadcrumb">

	</div>
	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-12 center">

				<div class="span12 center" style="text-align: center;">
					<ul class="quick-actions">
						<li><a href="/am"> <i class="icon-people"></i><spring:message code="menu.dashboard" /></a></li>
						<li><a href="/cp/captiveportal/index.wilas"><i class="icon-home"></i><spring:message code="menu.cp" />
						</a></li>
						<li><a href="/bi"> <i class="icon-graph"></i><spring:message code="menu.bi" />
						</a></li>
						<li><a href="/gf"> <i class="icon-web"></i><spring:message code="menu.gf" />
						</a></li>
					</ul>
				</div>

			</div>
		</div>

		<!-- news -->
		<div id="hideButSend" style="display: none;"><spring:message code="popwindow.button.send" /></div>
		<div id="hideButCancel" style="display: none;"><spring:message code="popwindow.button.cancel" /></div>
		<div class="row" > 
			<div class="col-xs-12 col-sm-6">
				<div class="widget-box" ng-controller='DemoController'>
					<!-- insert function  -->
					<div class="widget-content" id="dialog-form-new" title="Send News" ng-controller="submitNewsController">
						<form ng-submit="submit()" novalidate class="form-horizontal">  
							<div class="form-group">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label" style="padding-top:5px;"><spring:message code="popwindow.label.towhom" /></label>
								<div class="col-sm-9 col-md-9 col-lg-10"> 
									<select ng-model="message.toWho">
										<option value='0'><spring:message code="combobox.all" /></option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label" style="padding-top:5px;"><spring:message code="popwindow.label.message" /></label>
								<div class="col-sm-9 col-md-9 col-lg-10"> 
									<textarea style="width:100%" ng-model="message.msgBody" required></textarea>
								</div>
							</div>
							<div class="form-group" style="display: none;">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label"></label>
								<div class="col-sm-9 col-md-9 col-lg-10">
									<button id="newsSub" type="submit" class="btn btn-primary btn-sm">send</button>
								</div>
							</div>
						 </form>
				    </div>
					<!--  -->
					<div class="widget-title">
						<span class="icon"><i class="fa fa-file"></i></span>
						<h5><spring:message code="title.news" /></h5>
						<a ng-click="reddit.reload()"><span class="label label-info tip-left"><i class="fa fa-refresh"></i></span></a>
					</div>
					<div id="news" class="widget-content nopadding" style="height:600px;overflow:scroll">
						<ul class="recent-posts">
						<!--Angular Js -->
							<div>
							  <div infinite-scroll='reddit.nextPage()' infinite-scroll-disabled='reddit.busy' infinite-scroll-distance='1' infinite-scroll-container='#news'>
							  <li ng-repeat='item in reddit.items'>
									<div class="user-thumb">
										<img width="40" height="40" alt="User" src="img/demo/av2.jpg">
									</div>
									<div class="article-post">
										<span class="user-info"><spring:message code="assistant" /><spring:message code="poston" />{{item.action_date}}</span>
										<p>
											{{item.newsbody}}
										</p>
									</div>
								</li>
							    <div ng-show='reddit.busy'><spring:message code="caution.loading" /></div>
							  </div>
							</div>
						<!--Angular JS ends  -->
						</ul>
					</div>
				</div>
			</div>
			<!-- Notifications -->
			<div class="col-xs-12 col-sm-6">
				<div class="widget-box" ng-controller='NotificationController'>
					<!-- insert function  -->
					<div class="widget-content" id="dialog-form" title="Send Notification" ng-controller="submitNotificationController">
						<form ng-submit="submit()" novalidate class="form-horizontal">  
							<div class="form-group">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label" style="padding-top:5px;"><spring:message code="popwindow.label.towhom" /></label>
								<div class="col-sm-9 col-md-9 col-lg-10"> 
									<select ng-model="message.toWho">
										<option value='0'><spring:message code="combobox.all" /></option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label" style="padding-top:5px;"><spring:message code="popwindow.label.message" /></label>
								<div class="col-sm-9 col-md-9 col-lg-10"> 
									<textarea style="width:100%" ng-model="message.msgBody" required></textarea>
								</div>
							</div>
							<div class="form-group" style="display: none;">
								<label class="col-sm-3 col-md-3 col-lg-2 control-label"></label>
								<div class="col-sm-9 col-md-9 col-lg-10">
									<button id="noticSub" type="submit" class="btn btn-primary btn-sm">Send</button>
								</div>
							</div>
						 </form>
				    </div>
					<!--  -->
					<div class="widget-title">
						<span class="icon"><i class="fa fa-comment"></i></span>
						<h5><spring:message code="title.notification" /></h5>
						<a ng-click="wilasnotification.reload()"><span class="label label-info tip-left"><i class="fa fa-refresh"></i></span></a>
					</div>
					<div id="notifications" class="widget-content nopadding" style="height:600px;overflow:scroll">
						<ul class="recent-comments">
							<!--Angular Js -->
							  <div infinite-scroll='wilasnotification.nextPage()' infinite-scroll-disabled='wilasnotification.busy' infinite-scroll-distance='1' infinite-scroll-container='#notifications'>
								  <li ng-repeat='item in wilasnotification.items'>
										<div class="user-thumb">
											<img width="40" height="40" alt="User" src="img/demo/av1.jpg">
										</div>
										<div class="article-post">
											<span class="user-info">{{item.from_who}}<spring:message code="poston" />{{item.action_date}}</span>
											<p>
												{{item.msgbody}}
											</p>
										</div>
								   </li>
							       <div ng-show='wilasnotification.busy'><spring:message code="caution.loading" /></div>
							  </div>
							
						<!--Angular JS ends  -->
							
						</ul>
					</div>
				</div>
			</div>
			
		</div>
	</div>
	
</div>



<script src="${ WEBAPPS }/js/custom/dashboard_main.js"></script>

<%@ include file="../include/copyright.jsp"%>
<%@ include file="../home/footer.jsp"%>






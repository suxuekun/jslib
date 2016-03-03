<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.text.*"%>
<%@ page import="java.net.*"%>
<%@ page import="com.techstudio.util.*"%>
<%@ page import="com.techstudio.form.*"%>
<%@ page import="com.techstudio.form.controller.*"%>

<%--<%@ page import="org.apache.log4j.*"%>--%>

<%
	request.setAttribute("WEBAPPS", ConnConfig.getWebAppRoot());

	request.setAttribute("MYPAGE", request.getServletPath());

	request.setAttribute("SPRING_EXT", BaseController.SPRING_EXT);
%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

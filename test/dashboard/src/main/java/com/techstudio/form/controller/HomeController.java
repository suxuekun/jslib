package com.techstudio.form.controller;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.ldap.userdetails.InetOrgPerson;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.techstudio.util.LdapUtils;


@Controller
public class HomeController extends BaseController {

	private static final Logger log = Logger.getLogger(HomeController.class);

	protected static final String PARAM_USERNAME = "username";
	protected static final String PARAM_PASSWORD = "password";
	
	protected static final String HOMEFOLDER = "home/";

	@Value("${cas.server.url}")
	private String casServerUrl;
	
	

	@Override
	protected String getModuleFolder() {
		return HOMEFOLDER;
	}
	
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	@RequestMapping(value = "index" + SPRING_EXT)
	public String home(
			Model model,
//			@CookieValue(value = Const.COOKIE_AD_ID, required = false) String adId,
			HttpServletRequest req) {
//		if (!isLogin(req))
//			return getRedirectedLoginPath();
		return goToPageJsp("index");
	}
	
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	@RequestMapping(value = "leftnav" + SPRING_EXT)
	public String leftnav(
			Model model,
//			@CookieValue(value = Const.COOKIE_AD_ID, required = false) String adId,
			HttpServletRequest req) {
//		if (!isLogin(req))
//			return getRedirectedLoginPath();
		return goToPageJsp("leftnav");
	}

	@RequestMapping(value = "main" + SPRING_EXT)
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	public String main(
			Model model,
//			@CookieValue(value = Const.COOKIE_AD_ID, required = false) String adId,
			Authentication principal,
			HttpServletRequest req, HttpSession ses) {
		
		log.info("charles tenant:"+LdapUtils.getTenant(principal));
		log.info("charles reseller:"+LdapUtils.getReseller(principal));
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		log.info("uid:"+iop.getUid());
		log.info("cn:"+Arrays.deepToString(iop.getCn()));
		log.info("ou dot:"+LdapUtils.getOuWithDot(principal));
		
		
		
		return goToPageJsp("main");
	}

	
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	@RequestMapping(value = HOMEFOLDER + "logout" + SPRING_EXT)
	public String caslogout(Model model,HttpSession ses) {
		log.debug("caslogout() entry");
		ses.invalidate();
		return redirect(casServerUrl+"/logout");
	}
	
	
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	@RequestMapping(value = HOMEFOLDER + "test" + SPRING_EXT)
	public String test(Model model,HttpSession ses) {
		
		return goToPageJsp("test");
	}
	



	protected String getRedirectHome() {
		
		return SPRING_REDIRECT_PREFIX + "main" + SPRING_EXT;
	}

}

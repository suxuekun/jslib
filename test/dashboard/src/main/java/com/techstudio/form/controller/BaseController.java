package com.techstudio.form.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;


@Controller
public abstract class BaseController {
	private static final Log log = LogFactory.getLog( BaseController.class);
	public static final String SPRING_EXT = ".wilas";
	public static final String SPRING_REDIRECT_PREFIX = "redirect:/";
	
	public static final String PARAM_ACTION			= "action";
	
	public static final String PARAM_UI	= "ui";
	
	public static final String SESSION_ATTR_ROLE	= "role";
	public static final String SESSION_ATTR_USER	= "user";
	
	public static final int RECORD_PERPAGE_DEFAULT	= 10;
	protected static final DateFormat SDF_DD_MM_YYYY = new SimpleDateFormat("dd/MM/yyyy");
	protected static final DateFormat SDF_YYYY_MM_DD = new SimpleDateFormat("yyyyMMdd");
	protected static final DateFormat SDF_YYYY_MM_DD_HH_MM = new SimpleDateFormat("yyyyMMddHHmm");
	protected static final DateFormat SDF_LONG = new SimpleDateFormat("MMM dd, yyyy HH:mm");
	protected static final DateFormat SDF_LONG_WITHOUT_TIME = new SimpleDateFormat("MMM dd, yyyy");
	private static String validGlobalDateFormat = "";
	
	protected static final String DATE_TIME_FORMAT = "dd-MM-yyyy HH:mm";

	//	TODO: Rename DATE_FORMAT to GLOBAL_DATE_FORMAT
	public static final String DATE_FORMAT = validGlobalDateFormat;
	
	
	protected static final DateFormat SDF_DD_MMM_YYYY = new SimpleDateFormat("dd/MM/yyyy");
	protected static final DateFormat SDF_MMM_DD_YYYY = new SimpleDateFormat("MM/dd/yyyy HH:mm");
	protected static final DateFormat SDF_YYYY_MMM_DD = new SimpleDateFormat("yyyy/MM/dd HH:mm");
	protected static final DateFormat SDF_DD_MM_YYYY_DASH = new SimpleDateFormat(DATE_FORMAT);

	
	protected  static final String securityKey="94a1389b-4200-4394-bb10-57a9eca354bd";

	/**
	 * 
	 * @return subfolder located in "/WEB-INF/views/" for this current module
	 */
	protected abstract String getModuleFolder();
	
	protected String redirectToPageSpring(String strURL) {
		return "redirect:/" + strURL;
	}
	
	protected String goToPageJsp(String strURL) {
		return getModuleFolder() + strURL;
	}
	
	protected boolean isLogin(HttpServletRequest req) {
		return (req.getSession().getAttribute(SESSION_ATTR_USER) != null);
	}
	
	protected String getLoginPath() {
		return "login"+SPRING_EXT;
	}
	
	protected String getRedirectedLoginPath() {
		return "redirect:/"+getLoginPath();
	}
	
	protected String redirect(String url) {
		return "redirect:"+url;
	}
	
	
	
	protected String formatDateColumn(Date d) {
		if(d==null)
			return "";
		return SDF_LONG.format(d);
	}
	
	protected String formatDateColumnWithOutTime(Date d) {
		if(d==null)
			return "";
		return SDF_LONG_WITHOUT_TIME.format(d);
	}
}

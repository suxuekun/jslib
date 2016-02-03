package com.techstudio.common;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;


public class LocalConstant {
	
	public static final String REQUEST_INVALID             ="1 002 ERROR - Request Invalid";
	public static final String ERROR_DESTINATION           ="1 040 ERROR - Destination";
	public static final String ERROR_ID_NOTFOUND           ="2 065 ERROR - Mobile Authenticator Session-Id not found";
	public static final String ERROR_SMS_SERVER_NORESPOND  ="3 088 ERROR - SMS Server has wrong state of sending message.";
	public static final String ERROR_OTP_EXPIRED           ="1 066 EXPIRED - Mobile Authenticator OTP has expired"+"\n"+"REJECTED"+"\n";
	public static final String ERROR_OTP_NOTMATCH          ="2 066 ERROR - Mobile Authenticator OTP not matched"+"\n"+"REJECTED"+"\n";
	public static final String OTP_GENERATE                ="0 006 OK";
	public static final String OTP_MATCH                   ="0 007 OK\nMATCHED\n";
	
	public static final String TandcTheme                ="tandc";
	public static final String UandpTheme                ="uandp";
	public static final String SimpleQuestionFormTheme   ="sfq";
	public static final String OTPTheme                  ="otp";
	public static final String EmailLinkTheme            ="email";
	public static final String SocialTheme               ="social";
	public static final String NormalTheme               ="normal";
	
	public static final String NormalPage                ="1";
	public static final String TandcMode                 ="2";
	public static final String UandpMode   		         ="3";
	public static final String SFQMode                   ="4";
	public static final String OTPMode                   ="5";
	public static final String SocialMode                ="6";
	public static final String EmailMode                 ="7";
	
	
	
	public static final String LOGIN_DIRECT                ="login1";
	
	public static final String TANDC_LOGIN_SUC             ="tandc1";
	public static final String TANDC_LOGIN_UNSUC           ="tandc2";
	
	public static final String UANDP_LOGIN_SUC             ="uandp1";
	public static final String UANDP_LOGIN_PASSWORD_ERROR  ="uandp2";
	public static final String UANDP_LOGIN_NO_USER         ="uandp3";
	public static final String UANDP_NEW_USER_REGISTER     ="uandp4";
	
	public static final String SFQ_LOGIN_SUC               ="sfq1";
	public static final String SFQ_LOGIN_UNSUC             ="sfq2";
	public static final String SFQ_LOGIN_SUC_NO_NEED_ANSWER="sfq3";
	
	public static final String OTP_GENERATE_SUC            ="otp1";
	public static final String OTP_GENERATE_UNSUC          ="otp2";
	public static final String OTP_SMS_GATEWAY_ERROR       ="otp3";
	public static final String OTP_VALIDATE_ERROR          ="otp4";
	public static final String OTP_VALIDATE_NOT_MATCH      ="otp5";
	public static final String OTP_VALIDATE_EXPIRED        ="otp6";
	public static final String OTP_VALIDATE_SUC            ="otp7";
	public static final String OTP_LOGIN_SUC               ="otp8";
	
	public static final String SOCIAL_FACEBOOK_LOGIN_SUC   ="social1";
	public static final String SOCIAL_TWITTER_LOGIN_SUC    ="social2";
	
	public static final String EMAIL_OTP_LOGIN_SUC         ="email1";
	public static final String EMAIL_OTP_LOGIN_UNSUC       ="email2";
	public static final String EMAIL_OTP_GENERATE_SUC      ="email3";
	public static final String EMAIL_OTP_VEIFY_SUC         ="email4";
	public static final String EMAIL_OTP_EXPIRED         ="email5";
	
	public static final String EVENT_URL_TOUCH_SUC         ="event1";
	public static final String EVENT_URL_TOUCH_NOSUC       ="event2";
	
	public static final String ARUBA_CONTROLLER            ="aruba";
	public static final String MERAKI_CONTROLLER           ="meraki";
	
	private final static String SALT = "DGE$5SGr@3VsHYUMas2323E4d57vfBfFSTRU@!DSH(*%FDSdfg13sgfsg";
	private static final Logger log = Logger.getLogger(LocalConstant.class);
	
	public static final String whichTypeLayout(String pageType)
	{
		log.debug("Local pageType:" + pageType);
		switch(pageType)
		{
			case "1":
				pageType = LocalConstant.NormalTheme;
				break;
				
			case "2":
				pageType = LocalConstant.TandcTheme;
				break;
				
			case "3":
				pageType = LocalConstant.UandpTheme;
				break;
				
			case "4":
				pageType = LocalConstant.SimpleQuestionFormTheme;
				break;
				
			case "5":
				pageType = LocalConstant.OTPTheme;
				break;
				
			case "6":
				pageType = LocalConstant.SocialTheme;
				break;
				
			case "7":
				pageType = LocalConstant.EmailLinkTheme;
				break;
		}
		
		log.debug("Local pageType:" + pageType);
		return pageType;
	}
	
	public static final String whichTypeCode(String pageTypeCode)
	{
		
		switch(pageTypeCode)
		{
		case "1":
			pageTypeCode = "Normal Page";
			break;
			
		case "2":
			pageTypeCode = "Terms & conditions";
			break;
			
		case "3":
			pageTypeCode = "Username & Password";
			break;
			
		case "4":
			pageTypeCode = "Simple Question";
			break;
			
		case "5":
			pageTypeCode = "SMS OTP";
			break;
			
		case "6":
			pageTypeCode = "Social Login";
			break;
			
		case "7":
			pageTypeCode = "Email OTP";
			break;
		}
		
		return pageTypeCode;
	}
	
	/**/
	public static final String whichType(String pageType)
	{
		log.debug("Local pageType:" + pageType);
		switch(pageType)
		{
			case LocalConstant.TandcTheme:
				pageType = LocalConstant.TandcMode;
			break;
			
			case LocalConstant.UandpTheme:
				pageType = LocalConstant.UandpMode;
				
			break;
			
			case LocalConstant.SimpleQuestionFormTheme:
				pageType = LocalConstant.SFQMode;
			break;
			
			case LocalConstant.OTPTheme:
				pageType = LocalConstant.OTPMode;
			break;
			
			case LocalConstant.EmailLinkTheme:
				pageType = LocalConstant.EmailMode;
			break;
			
			case LocalConstant.SocialTheme:
				pageType = LocalConstant.SocialMode;
			break;
			
			case LocalConstant.NormalTheme:
				pageType = LocalConstant.NormalPage;
			break;
			
		}
		
		log.debug("Local pageType:" + pageType);
		return pageType;
	}
	
	
	/*Which Action*/
	public static final String WHICH_SUB_ACTION(String actioncode)
	{
		
//		public static final String LOGIN_DIRECT                ="login1";
//		
//		public static final String TANDC_LOGIN_SUC             ="tandc1";
//		public static final String TANDC_LOGIN_UNSUC           ="tandc2";
//		
//		public static final String UANDP_LOGIN_SUC             ="uandp1";
//		public static final String UANDP_LOGIN_PASSWORD_ERROR  ="uandp2";
//		public static final String UANDP_LOGIN_NO_USER         ="uandp3";
//		public static final String UANDP_NEW_USER_REGISTER     ="uandp4";
//		
//		public static final String SFQ_LOGIN_SUC               ="sfq1";
//		public static final String SFQ_LOGIN_UNSUC             ="sfq2";
//		
//		public static final String OTP_GENERATE_SUC            ="otp1";
//		public static final String OTP_GENERATE_UNSUC          ="otp2";
//		public static final String OTP_SMS_GATEWAY_ERROR       ="otp3";
//		public static final String OTP_VALIDATE_ERROR          ="otp4";
//		public static final String OTP_VALIDATE_NOT_MATCH      ="otp5";
//		public static final String OTP_VALIDATE_EXPIRED        ="otp6";
//		public static final String OTP_VALIDATE_SUC            ="otp7";
//		public static final String OTP_LOGIN_SUC               ="otp8";
//		
//		public static final String SOCIAL_FACEBOOK_LOGIN_SUC   ="social1";
//		public static final String SOCIAL_TWITTER_LOGIN_SUC    ="social2";
//		
//		public static final String EMAIL_OTL_LOGIN_SUC         ="email1";
//		public static final String EMAIL_OTL_LOGIN_UNSUC       ="email2";
		
//		{"Login in actived session",LocalConstant.LOGIN_DIRECT},
//		{"Login with Term and condition",LocalConstant.TANDC_LOGIN_SUC},
//		{"Login with User and password",LocalConstant.UANDP_LOGIN_SUC},
//		{"Login with Simple question",LocalConstant.SFQ_LOGIN_SUC},
		
//		{"Login with OTP",LocalConstant.OTP_LOGIN_SUC},
//		{"Wrong Password",LocalConstant.UANDP_LOGIN_PASSWORD_ERROR},
		
//		{"New user registed",LocalConstant.UANDP_NEW_USER_REGISTER},
//		{"OTP generate successfully",LocalConstant.OTP_GENERATE_SUC},
//		{"OTP generate unsuccessfully",LocalConstant.OTP_GENERATE_UNSUC},
//		{"OTP SMS Gateway no responding",LocalConstant.OTP_SMS_GATEWAY_ERROR},
//		{"OTP Validate error",LocalConstant.OTP_VALIDATE_NOT_MATCH},
//		{"OTP Validate successfully",LocalConstant.OTP_VALIDATE_SUC}
		
		log.debug("Local pageType:" + actioncode);
		switch(actioncode)
		{
			case LocalConstant.LOGIN_DIRECT:
				actioncode = "Login in actived session";
			break;
			
			case LocalConstant.TANDC_LOGIN_SUC:
				actioncode = "Login with Term and condition";
				
			break;
			
			case LocalConstant.UANDP_LOGIN_SUC:
				actioncode = "Login with User and password";
			break;
			
			case LocalConstant.SFQ_LOGIN_SUC:
				actioncode = "Login with Simple question";
			break;
			
			case LocalConstant.OTP_LOGIN_SUC:
				actioncode = "Login with OTP";
			break;
			
			case LocalConstant.UANDP_LOGIN_PASSWORD_ERROR:
				actioncode = "Wrong Password";
			break;
			
			case LocalConstant.UANDP_NEW_USER_REGISTER:
				actioncode = "New user registed";
			break;
			
			case LocalConstant.OTP_GENERATE_SUC:
				actioncode = "OTP generate successfully";
			break;
			
			case LocalConstant.OTP_GENERATE_UNSUC:
				actioncode = "OTP generate unsuccessfully";
			break;
			
			case LocalConstant.OTP_SMS_GATEWAY_ERROR:
				actioncode = "OTP SMS Gateway no responding";
			break;
			
			case LocalConstant.OTP_VALIDATE_NOT_MATCH:
				actioncode = "OTP Validate error";
			break;
			
			case LocalConstant.OTP_VALIDATE_SUC:
				actioncode = "OTP Validate successfully";
			break;
			
		}
		
		log.debug("Local pageType:" + actioncode);
		return actioncode;
	}
	
	public final static boolean ISNUMERIC(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		return pattern.matcher(str).matches();
	}
	
	public static String md5Hash(String message) {
		String md5 = "";
		if (null == message)
			return null;

		message = message + SALT;// adding a salt to the string before it gets
									// hashed.
		try {
			
			MessageDigest digest = MessageDigest.getInstance("MD5");// Create
																	// MessageDigest
																	// object
																	// for MD5
			digest.update(message.getBytes(), 0, message.length());// Update
																	// input
																	// string in
																	// message
																	// digest
			md5 = new BigInteger(1, digest.digest()).toString(16);// Converts
																	// message
																	// digest
																	// value in
																	// base 16
																	// (hex)

		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return md5;
	}
	
}

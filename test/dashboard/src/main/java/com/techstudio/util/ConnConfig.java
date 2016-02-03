package com.techstudio.util;
import java.io.*;
import java.util.*;

import org.apache.log4j.Logger;


public final class ConnConfig
{
	static String filename = "config.properties";
	static Properties prop;
	
	private static String WEB_APP_ROOT = "WEB_APP_ROOT";
	private static String Layout_ROOT = "Layout_ROOT";
	private static String Upload_ROOT = "Upload_ROOT";
	
	private static final Logger log = Logger.getLogger(ConnConfig.class);
	
	static{	
		try {
			if ( prop!=null )prop=null;
		 	prop = new Properties();
			prop.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(filename)); 
		}catch (Exception e){
			log.debug("Web Configuration file not found");
			e.printStackTrace();
		}
	}
	
	public static void reloadFile(){
		try {
			synchronized(prop){
			 	prop = new Properties();
				prop.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(filename)); 
			}
		}catch (IOException e){}
	}

	/**
	 * Retrieve the value of configuration
	 */
	public static String getProperty(String key) {
		synchronized(prop){
			return prop.getProperty(key); 
		}
	}
	
	public static String getWebAppRoot()
	{
		synchronized( prop )
		{
			log.debug(prop.getProperty( WEB_APP_ROOT ));
			return prop.getProperty( WEB_APP_ROOT ); 
		}
	}
	
	public static String getLayoutRoot()
	{
		synchronized( prop )
		{
			return prop.getProperty( Layout_ROOT ); 
		}
	}
	
	public static String getUploadRoot()
	{
		synchronized( prop )
		{
			return prop.getProperty( Upload_ROOT ); 
		}
	}
	
	
}

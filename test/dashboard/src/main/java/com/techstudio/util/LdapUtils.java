package com.techstudio.util;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;
import javax.ws.rs.core.SecurityContext;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.ldap.userdetails.InetOrgPerson;

public class LdapUtils {
	
	private static final Logger log = Logger.getLogger(LdapUtils.class);
	
	
	/*Principal param*/
	public static String getTenant(Authentication principal) {
		if(principal==null 
				|| !(principal.getPrincipal() instanceof InetOrgPerson))
			return null;
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		return getTenant(iop.getDn());
	}
	
	public static String getReseller(Authentication principal) {
		if(principal==null 
				|| !(principal.getPrincipal() instanceof InetOrgPerson))
			return null;
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		return getReseller(iop.getDn());
	}
	
	public static String getOuWithDot(Authentication principal) {
		if(principal==null 
				|| !(principal.getPrincipal() instanceof InetOrgPerson))
			return null;
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		return getOuWithDot(iop.getDn());
	}
	
	
	/*Restful security get*/
	
	
	public static String getDn(Authentication principal) {
		if(principal==null 
				|| !(principal.getPrincipal() instanceof InetOrgPerson))
			return null;
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		return iop.getDn();
	}
	
	public static String getPerson(Authentication principal) {
		if(principal==null 
				|| !(principal.getPrincipal() instanceof InetOrgPerson))
			return null;
		InetOrgPerson iop = (InetOrgPerson) principal.getPrincipal();
		return getPerson(iop.getDn());
	}
	
	public static String getOuWithDotREST(SecurityContext principal) {
		
		Authentication auth = (Authentication) principal.getUserPrincipal();
		InetOrgPerson iop = (InetOrgPerson) auth.getPrincipal();
		
		log.debug("iop.getUid():"+iop.getUid());
		return getOuWithDot(iop.getDn());
	}
	
	public static String getPersonREST(SecurityContext principal) {
		Authentication auth = (Authentication) principal.getUserPrincipal();
		InetOrgPerson iop = (InetOrgPerson) auth.getPrincipal();
		
		log.debug("iop.getUid():"+iop.getUid());
		return iop.getUid();
	}
	
	
	/*String param*/
	public static String getTenant(String dnStr) {
		try {
			LdapName dn = new LdapName(dnStr);
			if(dn.getRdns()==null || dn.getRdns().size()<=1)
				return null;
			return ""+dn.getRdn(1).getValue();
		} catch (InvalidNameException e) {
			log.error("exception in getTenant. dn="+dnStr+". e="+e.getMessage(), e);
		}
		return null;
	}
	
	public static String getReseller(String dnStr) {
		try {
			LdapName dn = new LdapName(dnStr);
			if(dn.getRdns()==null || dn.getRdns().size()<=1)
				return null;
			return ""+dn.getRdn(0).getValue();
		} catch (InvalidNameException e) {
			log.error("exception in getReseller. dn="+dnStr+". e="+e.getMessage(), e);
		}
		return null;
	}
	
	public static String getOuWithDot(String dnStr) {
		StringBuilder sb = new StringBuilder();
		try {
			LdapName dn = new LdapName(dnStr);
			if(dn.getRdns()==null || dn.getRdns().size()<1)
				return null;
			for(Rdn r: dn.getRdns()){
				log.debug("r.getType():"+r.getType());
				if(!StringUtils.equals("ou", r.getType()))
					break;
				if(sb.length()>0)
					sb.append('.');
				sb.append(r.getValue());
			}
			return sb.toString();
		} catch (InvalidNameException e) {
			log.error("exception in getOuWithDot. dn="+dnStr+". e="+e.getMessage(), e);
		}
		return sb.toString();
	}
	
	
	public static String getPerson(String dnStr) {
		StringBuilder sb = new StringBuilder();
		
		try {
			LdapName dn = new LdapName(dnStr);
			if(dn.getRdns()==null || dn.getRdns().size()<=1)
				return null;
			for(Rdn r: dn.getRdns()){
				if(!StringUtils.equals("uid", r.getType()))
					break;
				sb.append(r.getValue());
			}
		} catch (InvalidNameException e) {
			log.error("exception in getReseller. dn="+dnStr+". e="+e.getMessage(), e);
		}
		return sb.toString();
	}
	
}

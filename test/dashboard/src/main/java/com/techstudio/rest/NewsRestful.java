package com.techstudio.rest;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import com.techstudio.common.AjaxListPure;
import com.techstudio.dao.dashboard.NewsDao;
import com.techstudio.dao.dashboard.NotifiDao;
import com.techstudio.model.dashboard.News;
import com.techstudio.model.dashboard.Notification;
import com.techstudio.rest.obj.PostUp;
import com.techstudio.util.LdapUtils;


@Component
@Path("/messages")
public class NewsRestful {
	
	@Autowired
	private NewsDao newsDao;
	
	@Autowired
	private NotifiDao notifiDao;
	
	@Autowired
	private MessageSource messageSource;
	
	private static final Logger log = Logger.getLogger(NewsRestful.class);
	
	protected static final DateFormat SDF_DD_MMM_YYYY = new SimpleDateFormat("dd/MM/yyyy HH:mm");
	

	@GET
	@Path("/news_list.wilas")
	@Consumes(MediaType.TEXT_HTML)
    @Produces(MediaType.APPLICATION_JSON)
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	public AjaxListPure news_list(@QueryParam("pageNum") String pageNum) {
		
		log.debug("pageNum:"+pageNum);
		
		AjaxListPure resp = new AjaxListPure();
		int pageMax = newsDao.countAll();
		
		List<News> newsList = newsDao.issueAllNews(NumberUtils.toInt(pageNum), pageMax); 
		List<Map<String, Object>> aaList = new LinkedList<Map<String, Object>>();
		
		for (News r : newsList) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("id", r.getId());
			m.put("action_date", SDF_DD_MMM_YYYY.format(r.getAction_time()));
			m.put("newsbody", r.getNewBody());
			m.put("type", r.getType());
			aaList.add(m);
		}

		resp.setAaData(aaList);
		return resp;

	}
	
	@GET
	@Path("/notification_list.wilas")
	@Consumes(MediaType.TEXT_HTML)
    @Produces(MediaType.APPLICATION_JSON)
	@PreAuthorize("hasAnyRole('ROLE_WS_LOGIN','ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	public AjaxListPure notification_list(@QueryParam("pageNum") String pageNum, @Context SecurityContext principal) {
		
		log.debug("pageNum:"+pageNum);
		
		String ids = LdapUtils.getOuWithDotREST(principal);
		
		int count = StringUtils.countMatches(ids, ".");
		
		log.debug("count:" + count);
		
		if(count==2)
		{
			log.debug("abc"+StringUtils.lastIndexOf(ids, "."));
			int lastDot = StringUtils.lastIndexOf(ids, ".");
			
			ids = StringUtils.substring(ids, 0,lastDot);
			
			log.debug("ids:"+ids);
			
			
		}
		
		AjaxListPure resp = new AjaxListPure();
		int pageMax = notifiDao.countWithOu(ids);
		
		List<Notification> newsList = notifiDao.issueAllNotification(ids, Integer.valueOf(pageNum), pageMax); 
		List<Map<String, Object>> aaList = new LinkedList<Map<String, Object>>();
		
		for (Notification r : newsList) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("id", r.getId());
			m.put("action_date", SDF_DD_MMM_YYYY.format(r.getAction_time()));
			m.put("from_who", r.getFromwho());
			m.put("to_who", r.getTowhom());
			m.put("msgbody", r.getMsgBody());
			m.put("type", r.getType());
			aaList.add(m);
		}

		resp.setAaData(aaList);
		return resp;

	}
	
	
	@POST
	@Path("/postNotification.wilas")
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_JSON)
	@PreAuthorize("hasAnyRole('ROLE_WS_ROOT_ADMIN','ROLE_WS_CLIENT_ADMIN','ROLE_WS_DEPT_ADMIN','ROLE_WS_RESELLER_ADMIN')")
	public String postNotification(PostUp postUp, @Context SecurityContext principal,@Context Locale loc)
	{
		
		log.debug("Add new Notification");
		log.debug("typeMsg:"+postUp.getTypeMsg());
		log.debug("toWho:"+postUp.getToWho());
		log.debug("msgBody:"+postUp.getMsgBody());
		
		String ids = principal.getUserPrincipal().getName();
		
		log.debug("ids:"+ids);
		
		if(!ids.equals("techstudio")) ids = LdapUtils.getOuWithDotREST(principal);
		
		try {
			
			Date date = new Date();
			
			Notification notification = new Notification();
			notification.setAction_time(date);
			
			notification.setFromwho(LdapUtils.getPersonREST(principal));
			notification.setTowhom(postUp.getToWho());
			notification.setMsgBody(postUp.getMsgBody());
			notification.setOu(ids);
			notifiDao.save(notification);
			
			 log.info("|postNotification()|NO ERRORCODE|"+ids+"|typeMsg="+postUp.getTypeMsg()+"|Send a notification successfully.");
		     return messageSource.getMessage("server.respond.send.success", null, loc);
			
		} catch (Exception e) {
			log.error(e,e);
			log.info("|postNotification()|NO ERRORCODE|"+ids+"|typeMsg="+postUp.getTypeMsg()+"|Send a notification unsuccessfully.");
			return messageSource.getMessage("server.respond.send.unsuccess", null, loc);
			
		}
		
	}
	
	

	@POST
	@Path("/postNew.wilas")
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_JSON)
	@PreAuthorize("hasAnyRole('ROLE_WS_ROOT_ADMIN')")
	public String postNew(PostUp postUp, @Context SecurityContext principal,@Context Locale loc)
	{
		log.debug("Add new News");
		log.debug("typeMsg:"+postUp.getTypeMsg());
		log.debug("toWho:"+postUp.getToWho());
		log.debug("msgBody:"+postUp.getMsgBody());
		
		String ids = principal.getUserPrincipal().getName();
		
		log.debug("ids:"+ids);
		try {
			
			Date date = new Date();
			
	        if(!ids.equals("techstudio")) return "Sorry, only root Administrator can publish System News.";
	        
	        News news = new News();
	        news.setAction_time(date);
	        news.setNewBody(postUp.getMsgBody());
	        newsDao.save(news);
	        
	        log.info("|postNew()|NO ERRORCODE|"+ids+"|typeMsg="+postUp.getTypeMsg()+"|Send a news successfully.");
	        return messageSource.getMessage("server.respond.send.success", null, loc);
	        
		} catch (Exception e) {
			
			log.error(e,e);
			
			log.info("|postNew()|NO ERRORCODE|"+ids+"|typeMsg="+postUp.getTypeMsg()+"|Send a news unsuccessfully.");
			return messageSource.getMessage("server.respond.send.unsuccess", null, loc);
		}
		
	}
	



}

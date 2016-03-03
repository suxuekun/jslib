package com.techstudio.common;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public class EasyMail {
	

	
	
	private JavaMailSender mailSender;
	private SimpleMailMessage templateMessage;
	
	private static final Logger log = Logger.getLogger(EasyMail.class);
	
	public EasyMail(JavaMailSender mailSender, SimpleMailMessage templateMessage) {
	
		super();
		this.mailSender = mailSender;
		this.templateMessage = templateMessage;
	}
	
	public void sendMeMail(String from, String target, String subjectString, String contentString) {
		
		MimeMessage message = mailSender.createMimeMessage();
		
		try{
			
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
	 
			helper.setFrom(from);
			helper.setTo(target);
			helper.setSubject(subjectString);
			helper.setText(contentString);
	 
	 
		    }catch (MessagingException e) {
		    	 
		    	 log.error(e,e);
		    }
			
		
		try {

			this.mailSender.send(message);
			log.info("Mail sending, it will take times...");

			} catch (MailException e) {
			
				log.error(e,e);
			}
		
	}
	
}

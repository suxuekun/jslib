package com.techstudio.model.dashboard;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="notification")
public class Notification implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2290854963441971431L;

	
	@Id
	@GeneratedValue
	@Column(name = "id", columnDefinition="bigint", unique = true, nullable=false)
	private Long id;
	
	@Column(columnDefinition="varchar(200)",  nullable=false)
	private String msgBody;
	
	private Date action_time;
	
	@Column(columnDefinition="varchar(2)",  nullable=true)
	private String type;
	
	@Column(columnDefinition="varchar(100)",  nullable=false)
	private String fromwho;
	
	@Column(columnDefinition="varchar(100)",  nullable=false)
	private String towhom;
	
	@Column(columnDefinition="varchar(100)",  nullable=false)
	private String ou;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMsgBody() {
		return msgBody;
	}

	public void setMsgBody(String msgBody) {
		this.msgBody = msgBody;
	}

	public Date getAction_time() {
		return action_time;
	}

	public void setAction_time(Date action_time) {
		this.action_time = action_time;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFromwho() {
		return fromwho;
	}

	public void setFromwho(String fromwho) {
		this.fromwho = fromwho;
	}

	public String getTowhom() {
		return towhom;
	}

	public void setTowhom(String towhom) {
		this.towhom = towhom;
	}

	public String getOu() {
		return ou;
	}

	public void setOu(String ou) {
		this.ou = ou;
	}

	
}

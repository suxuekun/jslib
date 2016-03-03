package com.techstudio.model.dashboard;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="news")
public class News implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4624236877542870863L;
	
	@Id
	@GeneratedValue
	@Column(name = "id", columnDefinition="bigint", unique = true, nullable=false)
	private Long id;
	
	@Column(columnDefinition="varchar(200)",  nullable=false)
	private String newBody;
	
	private Date action_time;
	
	@Column(columnDefinition="varchar(2)",  nullable=true)
	private String type;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNewBody() {
		return newBody;
	}

	public void setNewBody(String newBody) {
		this.newBody = newBody;
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
	
	
}

package com.techstudio.common;

import java.io.Serializable;
import java.util.List;
import java.util.Map;


public class AjaxListResponse implements Serializable{

	private static final long serialVersionUID = -7522042265852862277L;

	private String sEcho;
	private Long iTotalRecords, iTotalDisplayRecords;
	private List<Map<String, Object>> aaData;
	public String getsEcho() {
		return sEcho;
	}
	public void setsEcho(String sEcho) {
		this.sEcho = sEcho;
	}
	public Long getiTotalRecords() {
		return iTotalRecords;
	}
	public void setiTotalRecords(Long iTotalRecords) {
		this.iTotalRecords = iTotalRecords;
	}
	public Long getiTotalDisplayRecords() {
		return iTotalDisplayRecords;
	}
	public void setiTotalDisplayRecords(Long iTotalDisplayRecords) {
		this.iTotalDisplayRecords = iTotalDisplayRecords;
	}
	public List<Map<String, Object>> getAaData() {
		return aaData;
	}
	public void setAaData(List<Map<String, Object>> aaData) {
		this.aaData = aaData;
	}

}
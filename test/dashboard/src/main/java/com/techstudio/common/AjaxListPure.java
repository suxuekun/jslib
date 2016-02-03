package com.techstudio.common;

import java.io.Serializable;
import java.util.List;
import java.util.Map;


public class AjaxListPure implements Serializable{


	/**
	 * 
	 */
	private static final long serialVersionUID = -4092742647403020655L;
	
	private List<Map<String, Object>> aaData;
	
	public List<Map<String, Object>> getAaData() {
		return aaData;
	}
	public void setAaData(List<Map<String, Object>> aaData) {
		this.aaData = aaData;
	}

}
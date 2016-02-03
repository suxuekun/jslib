package com.techstudio.dao.dashboard;

import java.util.List;

import com.techstudio.dao.BaseDao;
import com.techstudio.model.dashboard.Notification;

public interface NotifiDao extends BaseDao<Notification> {
	
	public int countWithOu(String ou);
	
	public List<Notification> issueAllNotification(String ou, int first, int max);
}

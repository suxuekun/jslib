package com.techstudio.dao.dashboard;

import java.util.List;

import com.techstudio.dao.BaseDao;
import com.techstudio.model.dashboard.News;

public interface NewsDao extends BaseDao<News> {
	
	public List<News> issueAllNews(int first, int max);

}

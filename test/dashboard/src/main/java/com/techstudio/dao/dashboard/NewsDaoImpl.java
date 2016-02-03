package com.techstudio.dao.dashboard;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.springframework.stereotype.Repository;

import com.techstudio.dao.BaseDaoImpl;
import com.techstudio.model.dashboard.News;

@Repository
@Transactional
public class NewsDaoImpl extends BaseDaoImpl<News> implements NewsDao {

   @Override
   public List<News> issueAllNews(int first, int max)
   {
	  Criteria criteria = super.createCriteria();
	  criteria.addOrder(Order.desc("action_time"));
	  return super.nextPage(criteria, first, max);
   }

}

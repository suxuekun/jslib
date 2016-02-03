package com.techstudio.dao.dashboard;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.techstudio.dao.BaseDaoImpl;
import com.techstudio.model.dashboard.Notification;

@Repository
@Transactional
public class NotifiDaoImpl extends BaseDaoImpl<Notification> implements NotifiDao {
	
	
	@Override
	public int countWithOu(String ou)
	{
		Criteria criteria = super.createCriteria();
		criteria.add(Restrictions.or(Restrictions.like("ou", ou+"%"), Restrictions.eq("ou", "techstudio")));

		return super.countAll(criteria);
	}
	
	@Override
	public List<Notification> issueAllNotification(String ou, int first, int max){
		Criteria criteria = super.createCriteria();
		criteria.add(Restrictions.or(Restrictions.like("ou", ou+"%"), Restrictions.eq("ou", "techstudio")));
		criteria.addOrder(Order.desc("action_time"));
		return super.nextPage(criteria, first, max);
	}

}

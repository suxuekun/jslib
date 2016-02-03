package com.techstudio.dao;  

/* WILAS Base Hibernate 4.0 Dao
 * Version 1.0
 * Author Charles Li
 * */

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;

@Transactional
public class BaseDaoImpl<T> implements BaseDao<T> {  
  
    // log4 class 
	private static final Logger log = Logger.getLogger(BaseDaoImpl.class);  
  
    // Big T class  
    private Class<T> entityClass;  
    
    
    /* 
     * sessionFactory 
     */  
    @Autowired 
    private SessionFactory sessionFactory;  
  
    // Ensure the Class  
    @SuppressWarnings({ "rawtypes", "unchecked" })  
    public BaseDaoImpl() {  
        Type genType = getClass().getGenericSuperclass();  
        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();  
        entityClass = (Class) params[0];  
    }  
   
    
    public Session getSession() {  
         
        return sessionFactory.getCurrentSession();  
    }  
  
    /* 
     * Save PO 
     */   
    public void save(T entity) {  
        getSession().save(entity);  
    }  
  
    /* 
     * Save and Update PO 
     */  
    public void saveOrUpdate(T entity) {  
        getSession().saveOrUpdate(entity);  
    }  
  
    /* 
     * Update PO 
     */  
    public void update(T entity) {  
        getSession().update(entity);  
  
    }  
  
    /* 
     * Merge PO 
     */  
    public void merge(T entity) {  
        getSession().merge(entity);  
    }  
  
    /* 
     * Delete PO by id 
     */  
    public void delete(Long id) {  
        getSession().delete(this.get(id));  
  
    }  
  
    /* 
     * Delete PO by object 
     */  
    public void deleteObject(T entity) {  
        getSession().delete(entity);  
    }  
  
    /* 
     * if PO exists by id 
     */  
    public boolean exists(Long id) {  
        return get(id) != null;  
    }  
  
    /* 
     * Load PO by id 
     */  
    @SuppressWarnings("unchecked")  
    public T load(Long id) {  
        return (T) getSession().load(this.entityClass, id);  
    }  
  
    /* 
     * get PO by id 
     */  
    @SuppressWarnings("unchecked")  
    public T get(Long id) {  
        return (T) getSession().get(this.entityClass, id);  
    }  
  
    /* 
     * get sum of PO(Default in entityClass) 
     */  
    public int countAll() {  
        Criteria criteria = createCriteria();  
        return Integer.valueOf(criteria.setProjection(Projections.rowCount())  
                .uniqueResult().toString());  
    }  
  
    /* 
     * get sum of PO(by Criteria) 
     */  
    public int countAll(Criteria criteria) {  
        return Integer.valueOf(criteria.setProjection(Projections.rowCount())  
                .uniqueResult().toString());  
    }  
  
    /* 
     * Delete all 
     */  
    public void deleteAll(Collection<?> entities) {  
        if (entities == null)  
            return;  
        for (Object entity : entities) {  
            getSession().delete(entity);
        }  
    }  
  
    /* 
     * List all 
     */  
    @SuppressWarnings("unchecked")  
    public List<T> list() {  
        return createCriteria().list();  
    }  
  
    /* 
     * List all by Criteria 
     */  
    @SuppressWarnings("unchecked")  
    public List<T> list(Criteria criteria) {  
        return criteria.list();  
    }  
  
    /* 
     * List all by offline 
     */  
    public List<T> list(DetachedCriteria criteria) {  
        return (List<T>) list(criteria.getExecutableCriteria(getSession()));  
    }  
  
    /* 
     *  
     * @param orderBy 
     *  
     * @param isAsc 
     *  
     * @return 
     */  
    @SuppressWarnings("unchecked")  
    public List<T> list(String orderBy, boolean isAsc) {  
        Criteria criteria = createCriteria();  
        if (isAsc) {  
            criteria.addOrder(Order.asc(orderBy));  
        } else {  
            criteria.addOrder(Order.desc(orderBy));  
        }  
        return criteria.list();  
    }  
  
    /* 
     *  
     * @param propertyName 
     *  
     * @param value 
     *  
     * @return 
     */  
    public List<T> list(String propertyName, Object value) {  
        Criterion criterion = Restrictions  
                .like(propertyName, "%" + value + "%");  
        return list(criterion);  
    }  
  
    /* 
     * query by criterion
     */  
    @SuppressWarnings("unchecked")  
    private List<T> list(Criterion criterion) {  
        Criteria criteria = createCriteria();  
        criteria.add(criterion);  
        return criteria.list();  
    }  
  
    /* 
     * Criterions query list 
     *  
     * @param criterions un limited Criterion 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    @SuppressWarnings("unchecked")  
    public List<T> list(Criterion... criterions) {  
        return createCriteria(criterions).list();  
    }  
  
    /* 
     * criteria only one value
     *  
     * @param propertyName 
     *  
     * @param value 
     *  
     * @return 
     */  
    @SuppressWarnings("unchecked")  
    public T uniqueResult(String propertyName, Object value) {  
        Criterion criterion = Restrictions.eq(propertyName, value);  
        return (T) createCriteria(criterion).uniqueResult();  
    }  
  
    /* 
     * Criteria query but uniqueResult
     *  
     * @param criterions of Criterion 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    public T uniqueResult(Criterion... criterions) {  
        Criteria criteria = createCriteria(criterions);  
        return uniqueResult(criteria);  
    }  
  
    /* 
     * Criteria query only one 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    @SuppressWarnings("unchecked")  
    public T uniqueResult(Criteria criteria) {  
        return (T) criteria.uniqueResult();  
    }  
  
    /* 
     * Criteria to distinct transformer 
     *  
     * @param criteria 
     *  
     * @return 
     */  

    public Criteria distinct(Criteria criteria) {  
        criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);  
        return criteria;  
    }  
  
    /* 
     * force to clean session 
     */  
    public void flush() {  
        getSession().flush();  
    }  
  
    /* 
     * clear session 
     */  
    public void clear() {  
        getSession().clear();  
    }  
  
    /* 
     * create Criteria 
     */  
    public Criteria createCriteria() {  
        return getSession().createCriteria(entityClass);  
    }  
  
    /* 
     * Criterion in Criteria 
     *  
     * @param criterions of Criterion 
     */  
    public Criteria createCriteria(Criterion... criterions) {  
        Criteria criteria = createCriteria();  
        for (Criterion c : criterions) {  
            criteria.add(c);  
        }  
        return criteria;  
    }  
  
    /* 
     * Page Criteria 
     *  
     * @param 
     *  
     * @return 
     */  
    @Override
    public List<T> findPage(Criteria criteria,int pageNo, int pageSize) {  
        // start from  
        criteria.setFirstResult((pageNo - 1) * pageSize);  
        // max date  
        criteria.setMaxResults(pageSize);  
        return list(criteria);  
    }  
    
    @Override
    public List<T> nextPage(Criteria criteria,int pageNo, int pageSize) {  
        // start from  
        if(pageNo>1) criteria.setFirstResult(pageNo);  
        // max date  
        criteria.setMaxResults(pageSize);  
        return list(criteria);  
    }  
 
  
}  
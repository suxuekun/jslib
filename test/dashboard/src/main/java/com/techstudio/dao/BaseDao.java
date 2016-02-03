package com.techstudio.dao;

import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;


@Transactional
public interface BaseDao<T> {
     
    public void save(T entity);
  
    /* 
     * Save and Update PO 
     */  
    public void saveOrUpdate(T entity);
  
    /* 
     * Update PO 
     */  
    public void update(T entity);
  
    /* 
     * Merge PO 
     */  
    public void merge(T entity);
  
    /* 
     * Delete PO by id 
     */  
    public void delete(Long id);
  
    /* 
     * Delete PO by object 
     */  
    public void deleteObject(T entity);
  
    /* 
     * if PO exists by id 
     */  
    public boolean exists(Long id);
  
    /* 
     * Load PO by id 
     */  
    public T load(Long id);
  
    /* 
     * get PO by id 
     */  
    public T get(Long id);
    
    /* 
     * get sum of PO(Default in entityClass) 
     */  
    public int countAll();
  
    /* 
     * get sum of PO(by Criteria) 
     */  
    public int countAll(Criteria criteria);
  
    /* 
     * Delete all 
     */  
    public void deleteAll(Collection<?> entities);
  
    /* 
     * List all 
     */  
    public List<T> list();
  
    /* 
     * List all by Criteria 
     */  
    public List<T> list(Criteria criteria);
  
    /* 
     * List all by offline 
     */  
    public List<T> list(DetachedCriteria criteria);
  
    /* 
     *  
     * @param orderBy 
     *  
     * @param isAsc 
     *  
     * @return 
     */  
    public List<T> list(String orderBy, boolean isAsc);
  
    /* 
     *  
     * @param propertyName 
     *  
     * @param value 
     *  
     * @return 
     */  
    public List<T> list(String propertyName, Object value);
  
    /* 
     * query by criterion
     */  
   
  
    /* 
     * Criterions query list 
     *  
     * @param criterions unnumbered Criterion 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    public List<T> list(Criterion... criterions);
  
    /* 
     * criteria only one value
     *  
     * @param propertyName 
     *  
     * @param value 
     *  
     * @return 
     */  
    public T uniqueResult(String propertyName, Object value);
  
    /* 
     * Criteria query but uniqueResult
     *  
     * @param criterions of Criterion 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    public T uniqueResult(Criterion... criterions);
  
    /* 
     * Criteria query only one 
     *  
     * @param criterions 
     *  
     * @return 
     */  
    public T uniqueResult(Criteria criteria);
  
    /* 
     * Criteria to distinct transformer 
     *  
     * @param criteria 
     *  
     * @return 
     */  

    public Criteria distinct(Criteria criteria);
  
    /* 
     * force to clean session 
     */  
    public void flush();
  
    /* 
     * clear session 
     */  
    public void clear();
  
    /* 
     * create Criteria 
     */  
    public Criteria createCriteria();
  
    /* 
     * Criterion in Criteria 
     *  
     * @param criterions of Criterion 
     */  
    public Criteria createCriteria(Criterion... criterions);
  
    /* 
     * Page Criteria 
     *  
     * @param 
     *  
     * @return 
     */  
    public List<T> findPage( Criteria criteria,  int pageNo, int pageSize);
    
    public List<T> nextPage( Criteria criteria,  int pageNo, int pageSize);
 
}

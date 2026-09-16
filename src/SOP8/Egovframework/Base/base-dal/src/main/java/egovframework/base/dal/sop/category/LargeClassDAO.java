package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.LargeClass;
import egovframework.base.generic.Holder;

@Repository
public class LargeClassDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<LargeClass> selectLargeClasses(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		if (orderBy != null && !orderBy.trim().isEmpty())
		{
			internalParams.put("orderBy", orderBy);
		}

		List<LargeClass> result = null;

		try {
			result = sqlSession.selectList("largeClassMapper.selectLargeClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public LargeClass selectLargeClass(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<LargeClass> result = null;

		try {
			result = sqlSession.selectList("largeClassMapper.selectLargeClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertLargeClass(LargeClass largeClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("largeClassMapper.insertLargeClass", largeClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertLargeClasses(List<LargeClass> largeClasses, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("largeClassMapper.insertLargeClasses", largeClasses);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateLargeClass(LargeClass largeClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("largeClassMapper.updateLargeClass", largeClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateLargeClass(Map<LargeClass.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateLargeClass(params, errorMessage);
	}

	public boolean updateLargeClass(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("largeClassMapper.updateLargeClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteLargeClass(LargeClass largeClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("largeClassMapper.deleteLargeClass", largeClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteLargeClass(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("largeClassMapper.deleteLargeClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

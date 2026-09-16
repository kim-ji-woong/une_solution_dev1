package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.MiddleClass;
import egovframework.base.generic.Holder;

@Repository
public class MiddleClassDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<MiddleClass> selectMiddleClasses(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<MiddleClass> result = null;

		try {
			result = sqlSession.selectList("middleClassMapper.selectMiddleClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public MiddleClass selectMiddleClass(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<MiddleClass> result = null;

		try {
			result = sqlSession.selectList("middleClassMapper.selectMiddleClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertMiddleClass(MiddleClass middleClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("middleClassMapper.insertMiddleClass", middleClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertMiddleClasses(List<MiddleClass> middleClasses, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("middleClassMapper.insertMiddleClasses", middleClasses);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMiddleClass(MiddleClass middleClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("middleClassMapper.updateMiddleClass", middleClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMiddleClass(Map<MiddleClass.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateMiddleClass(params, errorMessage);
	}

	public boolean updateMiddleClass(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("middleClassMapper.updateMiddleClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMiddleClass(MiddleClass middleClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("middleClassMapper.deleteMiddleClass", middleClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMiddleClass(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("middleClassMapper.deleteMiddleClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

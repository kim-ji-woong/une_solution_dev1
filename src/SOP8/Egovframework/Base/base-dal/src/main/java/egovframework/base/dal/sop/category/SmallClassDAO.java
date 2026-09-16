package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.SmallClass;
import egovframework.base.generic.Holder;

@Repository
public class SmallClassDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SmallClass> selectSmallClasses(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SmallClass> result = null;

		try {
			result = sqlSession.selectList("smallClassMapper.selectSmallClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SmallClass selectSmallClass(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SmallClass> result = null;

		try {
			result = sqlSession.selectList("smallClassMapper.selectSmallClasses", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSmallClass(SmallClass smallClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("smallClassMapper.insertSmallClass", smallClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSmallClasses(List<SmallClass> smallClasses, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("smallClassMapper.insertSmallClasses", smallClasses);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSmallClass(SmallClass smallClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("smallClassMapper.updateSmallClass", smallClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSmallClass(Map<SmallClass.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSmallClass(params, errorMessage);
	}

	public boolean updateSmallClass(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("smallClassMapper.updateSmallClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSmallClass(SmallClass smallClass, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("smallClassMapper.deleteSmallClass", smallClass);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSmallClass(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("smallClassMapper.deleteSmallClassByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.weather;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.weather.Weekly;
import egovframework.base.generic.Holder;

@Repository
public class WeeklyDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Weekly> selectWeeklies(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Weekly> result = null;

		try {
			result = sqlSession.selectList("weeklyMapper.selectWeeklies", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Weekly selectWeekly(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Weekly> result = null;

		try {
			result = sqlSession.selectList("weeklyMapper.selectWeeklies", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertWeekly(Weekly weekly, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weeklyMapper.insertWeekly", weekly);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertWeeklies(List<Weekly> weeklies, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weeklyMapper.insertWeeklies", weeklies);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeekly(Weekly weekly, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weeklyMapper.updateWeekly", weekly);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeekly(Map<Weekly.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateWeekly(params, errorMessage);
	}

	public boolean updateWeekly(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weeklyMapper.updateWeeklyByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeekly(Weekly weekly, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("weeklyMapper.deleteWeekly", weekly);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeekly(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("weeklyMapper.deleteWeeklyByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

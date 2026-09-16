package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.SensorReaction;
import egovframework.base.generic.Holder;

@Repository
public class SensorReactionDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SensorReaction> selectSensorReactions(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SensorReaction> result = null;

		try {
			result = sqlSession.selectList("sensorReactionMapper.selectSensorReactions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SensorReaction selectSensorReaction(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SensorReaction> result = null;

		try {
			result = sqlSession.selectList("sensorReactionMapper.selectSensorReactions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSensorReaction(SensorReaction sensorReaction, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorReactionMapper.insertSensorReaction", sensorReaction);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSensorReactions(List<SensorReaction> sensorReactions, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorReactionMapper.insertSensorReactions", sensorReactions);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorReaction(SensorReaction sensorReaction, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorReactionMapper.updateSensorReaction", sensorReaction);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorReaction(Map<SensorReaction.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSensorReaction(params, errorMessage);
	}

	public boolean updateSensorReaction(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorReactionMapper.updateSensorReactionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorReaction(SensorReaction sensorReaction, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sensorReactionMapper.deleteSensorReaction", sensorReaction);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorReaction(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sensorReactionMapper.deleteSensorReactionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.SensorZone;
import egovframework.base.generic.Holder;

@Repository
public class SensorZoneDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SensorZone> selectSensorZones(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SensorZone> result = null;

		try {
			result = sqlSession.selectList("sensorZoneMapper.selectSensorZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SensorZone selectSensorZone(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SensorZone> result = null;

		try {
			result = sqlSession.selectList("sensorZoneMapper.selectSensorZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSensorZone(SensorZone sensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneMapper.insertSensorZone", sensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSensorZones(List<SensorZone> sensorZones, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneMapper.insertSensorZones", sensorZones);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZone(SensorZone sensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneMapper.updateSensorZone", sensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZone(Map<SensorZone.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSensorZone(params, errorMessage);
	}

	public boolean updateSensorZone(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneMapper.updateSensorZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZone(SensorZone sensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sensorZoneMapper.deleteSensorZone", sensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZone(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sensorZoneMapper.deleteSensorZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

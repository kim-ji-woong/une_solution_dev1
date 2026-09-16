package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.SensorSensorZone;
import egovframework.base.generic.Holder;

@Repository
public class SensorSensorZoneDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SensorSensorZone> selectSensorSensorZones(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SensorSensorZone> result = null;

		try {
			result = sqlSession.selectList("sensorSensorZoneMapper.selectSensorSensorZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SensorSensorZone selectSensorSensorZone(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SensorSensorZone> result = null;

		try {
			result = sqlSession.selectList("sensorSensorZoneMapper.selectSensorSensorZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSensorSensorZone(SensorSensorZone sensorSensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorSensorZoneMapper.insertSensorSensorZone", sensorSensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSensorSensorZones(List<SensorSensorZone> sensorSensorZones, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorSensorZoneMapper.insertSensorSensorZones", sensorSensorZones);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorSensorZone(SensorSensorZone sensorSensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorSensorZoneMapper.updateSensorSensorZone", sensorSensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorSensorZone(Map<SensorSensorZone.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSensorSensorZone(params, errorMessage);
	}

	public boolean updateSensorSensorZone(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorSensorZoneMapper.updateSensorSensorZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorSensorZone(SensorSensorZone sensorSensorZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sensorSensorZoneMapper.deleteSensorSensorZone", sensorSensorZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorSensorZone(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sensorSensorZoneMapper.deleteSensorSensorZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

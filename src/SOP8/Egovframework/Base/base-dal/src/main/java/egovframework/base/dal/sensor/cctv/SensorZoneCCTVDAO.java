package egovframework.base.dal.sensor.cctv;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.cctv.SensorZoneCCTV;
import egovframework.base.generic.Holder;

@Repository
public class SensorZoneCCTVDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SensorZoneCCTV> selectSensorZoneCCTVs(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SensorZoneCCTV> result = null;

		try {
			result = sqlSession.selectList("sensorZoneCCTVMapper.selectSensorZoneCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SensorZoneCCTV selectSensorZoneCCTV(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SensorZoneCCTV> result = null;

		try {
			result = sqlSession.selectList("sensorZoneCCTVMapper.selectSensorZoneCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSensorZoneCCTV(SensorZoneCCTV sensorZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneCCTVMapper.insertSensorZoneCCTV", sensorZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSensorZoneCCTVs(List<SensorZoneCCTV> sensorZoneCCTVs, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneCCTVMapper.insertSensorZoneCCTVs", sensorZoneCCTVs);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZoneCCTV(SensorZoneCCTV sensorZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneCCTVMapper.updateSensorZoneCCTV", sensorZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZoneCCTV(Map<SensorZoneCCTV.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSensorZoneCCTV(params, errorMessage);
	}

	public boolean updateSensorZoneCCTV(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneCCTVMapper.updateSensorZoneCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZoneCCTV(SensorZoneCCTV sensorZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sensorZoneCCTVMapper.deleteSensorZoneCCTV", sensorZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZoneCCTV(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sensorZoneCCTVMapper.deleteSensorZoneCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

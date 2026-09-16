package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.SensorZoneDetail;
import egovframework.base.generic.Holder;

@Repository
public class SensorZoneDetailDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SensorZoneDetail> selectSensorZoneDetails(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SensorZoneDetail> result = null;

		try {
			result = sqlSession.selectList("sensorZoneDetailMapper.selectSensorZoneDetails", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SensorZoneDetail selectSensorZoneDetail(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SensorZoneDetail> result = null;

		try {
			result = sqlSession.selectList("sensorZoneDetailMapper.selectSensorZoneDetails", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSensorZoneDetail(SensorZoneDetail sensorZoneDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneDetailMapper.insertSensorZoneDetail", sensorZoneDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSensorZoneDetails(List<SensorZoneDetail> sensorZoneDetails, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sensorZoneDetailMapper.insertSensorZoneDetails", sensorZoneDetails);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZoneDetail(SensorZoneDetail sensorZoneDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneDetailMapper.updateSensorZoneDetail", sensorZoneDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSensorZoneDetail(Map<SensorZoneDetail.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSensorZoneDetail(params, errorMessage);
	}

	public boolean updateSensorZoneDetail(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sensorZoneDetailMapper.updateSensorZoneDetailByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZoneDetail(SensorZoneDetail sensorZoneDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sensorZoneDetailMapper.deleteSensorZoneDetail", sensorZoneDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSensorZoneDetail(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sensorZoneDetailMapper.deleteSensorZoneDetailByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

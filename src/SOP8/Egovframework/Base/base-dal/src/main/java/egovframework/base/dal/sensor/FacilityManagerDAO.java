package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.FacilityManager;
import egovframework.base.generic.Holder;

@Repository
public class FacilityManagerDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<FacilityManager> selectFacilityManagers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<FacilityManager> result = null;

		try {
			result = sqlSession.selectList("facilityManagerMapper.selectFacilityManagers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public FacilityManager selectFacilityManager(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<FacilityManager> result = null;

		try {
			result = sqlSession.selectList("facilityManagerMapper.selectFacilityManagers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertFacilityManager(FacilityManager facilityManager, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerMapper.insertFacilityManager", facilityManager);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertFacilityManagers(List<FacilityManager> facilityManagers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerMapper.insertFacilityManagers", facilityManagers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManager(FacilityManager facilityManager, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerMapper.updateFacilityManager", facilityManager);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManager(Map<FacilityManager.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateFacilityManager(params, errorMessage);
	}

	public boolean updateFacilityManager(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerMapper.updateFacilityManagerByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManager(FacilityManager facilityManager, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("facilityManagerMapper.deleteFacilityManager", facilityManager);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManager(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("facilityManagerMapper.deleteFacilityManagerByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

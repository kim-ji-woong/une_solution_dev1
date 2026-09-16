package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.FacilityManagerTemporary;
import egovframework.base.generic.Holder;

@Repository
public class FacilityManagerTemporaryDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<FacilityManagerTemporary> selectFacilityManagerTemporaries(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<FacilityManagerTemporary> result = null;

		try {
			result = sqlSession.selectList("facilityManagerTemporaryMapper.selectFacilityManagerTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public FacilityManagerTemporary selectFacilityManagerTemporary(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<FacilityManagerTemporary> result = null;

		try {
			result = sqlSession.selectList("facilityManagerTemporaryMapper.selectFacilityManagerTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertFacilityManagerTemporary(FacilityManagerTemporary facilityManagerTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerTemporaryMapper.insertFacilityManagerTemporary", facilityManagerTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertFacilityManagerTemporaries(List<FacilityManagerTemporary> facilityManagerTemporaries, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerTemporaryMapper.insertFacilityManagerTemporaries", facilityManagerTemporaries);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerTemporary(FacilityManagerTemporary facilityManagerTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerTemporaryMapper.updateFacilityManagerTemporary", facilityManagerTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerTemporary(Map<FacilityManagerTemporary.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateFacilityManagerTemporary(params, errorMessage);
	}

	public boolean updateFacilityManagerTemporary(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerTemporaryMapper.updateFacilityManagerTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerTemporary(FacilityManagerTemporary facilityManagerTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("facilityManagerTemporaryMapper.deleteFacilityManagerTemporary", facilityManagerTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerTemporary(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("facilityManagerTemporaryMapper.deleteFacilityManagerTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

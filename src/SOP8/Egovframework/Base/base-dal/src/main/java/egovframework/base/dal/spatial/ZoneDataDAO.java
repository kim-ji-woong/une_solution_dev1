package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.ZoneData;
import egovframework.base.generic.Holder;

@Repository
public class ZoneDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ZoneData> selectZoneDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ZoneData> result = null;

		try {
			result = sqlSession.selectList("zoneDataMapper.selectZoneDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ZoneData selectZoneData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ZoneData> result = null;

		try {
			result = sqlSession.selectList("zoneDataMapper.selectZoneDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertZoneData(ZoneData zoneData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("zoneDataMapper.insertZoneData", zoneData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertZoneDatas(List<ZoneData> zoneDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("zoneDataMapper.insertZoneDatas", zoneDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateZoneData(ZoneData zoneData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("zoneDataMapper.updateZoneData", zoneData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateZoneData(Map<ZoneData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateZoneData(params, errorMessage);
	}

	public boolean updateZoneData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("zoneDataMapper.updateZoneDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteZoneData(ZoneData zoneData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("zoneDataMapper.deleteZoneData", zoneData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteZoneData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("zoneDataMapper.deleteZoneDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

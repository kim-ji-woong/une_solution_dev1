package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.BuildingData;
import egovframework.base.generic.Holder;

@Repository
public class BuildingDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<BuildingData> selectBuildingDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<BuildingData> result = null;

		try {
			result = sqlSession.selectList("buildingDataMapper.selectBuildingDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public BuildingData selectBuildingData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<BuildingData> result = null;

		try {
			result = sqlSession.selectList("buildingDataMapper.selectBuildingDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertBuildingData(BuildingData buildingData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingDataMapper.insertBuildingData", buildingData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertBuildingDatas(List<BuildingData> buildingDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingDataMapper.insertBuildingDatas", buildingDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingData(BuildingData buildingData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingDataMapper.updateBuildingData", buildingData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingData(Map<BuildingData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateBuildingData(params, errorMessage);
	}

	public boolean updateBuildingData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingDataMapper.updateBuildingDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingData(BuildingData buildingData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("buildingDataMapper.deleteBuildingData", buildingData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("buildingDataMapper.deleteBuildingDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.BuildingGroupData;
import egovframework.base.generic.Holder;

@Repository
public class BuildingGroupDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<BuildingGroupData> selectBuildingGroupDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<BuildingGroupData> result = null;

		try {
			result = sqlSession.selectList("buildingGroupDataMapper.selectBuildingGroupDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public BuildingGroupData selectBuildingGroupData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<BuildingGroupData> result = null;

		try {
			result = sqlSession.selectList("buildingGroupDataMapper.selectBuildingGroupDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertBuildingGroupData(BuildingGroupData buildingGroupData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingGroupDataMapper.insertBuildingGroupData", buildingGroupData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertBuildingGroupDatas(List<BuildingGroupData> buildingGroupDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingGroupDataMapper.insertBuildingGroupDatas", buildingGroupDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingGroupData(BuildingGroupData buildingGroupData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingGroupDataMapper.updateBuildingGroupData", buildingGroupData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingGroupData(Map<BuildingGroupData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateBuildingGroupData(params, errorMessage);
	}

	public boolean updateBuildingGroupData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingGroupDataMapper.updateBuildingGroupDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingGroupData(BuildingGroupData buildingGroupData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("buildingGroupDataMapper.deleteBuildingGroupData", buildingGroupData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingGroupData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("buildingGroupDataMapper.deleteBuildingGroupDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

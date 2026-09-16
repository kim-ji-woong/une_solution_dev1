package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.BuildingGroup;
import egovframework.base.generic.Holder;

@Repository
public class BuildingGroupDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<BuildingGroup> selectBuildingGroups(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<BuildingGroup> result = null;

		try {
			result = sqlSession.selectList("buildingGroupMapper.selectBuildingGroups", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public BuildingGroup selectBuildingGroup(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<BuildingGroup> result = null;

		try {
			result = sqlSession.selectList("buildingGroupMapper.selectBuildingGroups", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertBuildingGroup(BuildingGroup buildingGroup, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingGroupMapper.insertBuildingGroup", buildingGroup);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertBuildingGroups(List<BuildingGroup> buildingGroups, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("buildingGroupMapper.insertBuildingGroups", buildingGroups);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingGroup(BuildingGroup buildingGroup, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingGroupMapper.updateBuildingGroup", buildingGroup);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBuildingGroup(Map<BuildingGroup.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateBuildingGroup(params, errorMessage);
	}

	public boolean updateBuildingGroup(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("buildingGroupMapper.updateBuildingGroupByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingGroup(BuildingGroup buildingGroup, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("buildingGroupMapper.deleteBuildingGroup", buildingGroup);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBuildingGroup(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("buildingGroupMapper.deleteBuildingGroupByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

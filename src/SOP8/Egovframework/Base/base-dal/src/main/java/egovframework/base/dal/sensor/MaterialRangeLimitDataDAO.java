package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.MaterialRangeLimitData;
import egovframework.base.generic.Holder;

@Repository
public class MaterialRangeLimitDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<MaterialRangeLimitData> selectMaterialRangeLimitDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<MaterialRangeLimitData> result = null;

		try {
			result = sqlSession.selectList("materialRangeLimitDataMapper.selectMaterialRangeLimitDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public MaterialRangeLimitData selectMaterialRangeLimitData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<MaterialRangeLimitData> result = null;

		try {
			result = sqlSession.selectList("materialRangeLimitDataMapper.selectMaterialRangeLimitDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertMaterialRangeLimitData(MaterialRangeLimitData materialRangeLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialRangeLimitDataMapper.insertMaterialRangeLimitData", materialRangeLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertMaterialRangeLimitDatas(List<MaterialRangeLimitData> materialRangeLimitDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialRangeLimitDataMapper.insertMaterialRangeLimitDatas", materialRangeLimitDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterialRangeLimitData(MaterialRangeLimitData materialRangeLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialRangeLimitDataMapper.updateMaterialRangeLimitData", materialRangeLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterialRangeLimitData(Map<MaterialRangeLimitData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateMaterialRangeLimitData(params, errorMessage);
	}

	public boolean updateMaterialRangeLimitData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialRangeLimitDataMapper.updateMaterialRangeLimitDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterialRangeLimitData(MaterialRangeLimitData materialRangeLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("materialRangeLimitDataMapper.deleteMaterialRangeLimitData", materialRangeLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterialRangeLimitData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("materialRangeLimitDataMapper.deleteMaterialRangeLimitDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

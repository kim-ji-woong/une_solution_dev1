package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.MaterialLimitData;
import egovframework.base.generic.Holder;

@Repository
public class MaterialLimitDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<MaterialLimitData> selectMaterialLimitDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<MaterialLimitData> result = null;

		try {
			result = sqlSession.selectList("materialLimitDataMapper.selectMaterialLimitDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public MaterialLimitData selectMaterialLimitData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<MaterialLimitData> result = null;

		try {
			result = sqlSession.selectList("materialLimitDataMapper.selectMaterialLimitDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertMaterialLimitData(MaterialLimitData materialLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialLimitDataMapper.insertMaterialLimitData", materialLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertMaterialLimitDatas(List<MaterialLimitData> materialLimitDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialLimitDataMapper.insertMaterialLimitDatas", materialLimitDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterialLimitData(MaterialLimitData materialLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialLimitDataMapper.updateMaterialLimitData", materialLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterialLimitData(Map<MaterialLimitData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateMaterialLimitData(params, errorMessage);
	}

	public boolean updateMaterialLimitData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialLimitDataMapper.updateMaterialLimitDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterialLimitData(MaterialLimitData materialLimitData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("materialLimitDataMapper.deleteMaterialLimitData", materialLimitData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterialLimitData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("materialLimitDataMapper.deleteMaterialLimitDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

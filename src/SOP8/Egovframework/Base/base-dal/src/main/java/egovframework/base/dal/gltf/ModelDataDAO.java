package egovframework.base.dal.gltf;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.gltf.ModelData;
import egovframework.base.generic.Holder;

@Repository
public class ModelDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ModelData> selectModelDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ModelData> result = null;

		try {
			result = sqlSession.selectList("modelDataMapper.selectModelDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ModelData selectModelData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ModelData> result = null;

		try {
			result = sqlSession.selectList("modelDataMapper.selectModelDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertModelData(ModelData modelData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("modelDataMapper.insertModelData", modelData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertModelDatas(List<ModelData> modelDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("modelDataMapper.insertModelDatas", modelDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateModelData(ModelData modelData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("modelDataMapper.updateModelData", modelData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateModelData(Map<ModelData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateModelData(params, errorMessage);
	}

	public boolean updateModelData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("modelDataMapper.updateModelDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteModelData(ModelData modelData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("modelDataMapper.deleteModelData", modelData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteModelData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("modelDataMapper.deleteModelDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.gltf;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.gltf.ModelOrthoData;
import egovframework.base.generic.Holder;

@Repository
public class ModelOrthoDataDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ModelOrthoData> selectModelOrthoDatas(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ModelOrthoData> result = null;

		try {
			result = sqlSession.selectList("modelOrthoDataMapper.selectModelOrthoDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ModelOrthoData selectModelOrthoData(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ModelOrthoData> result = null;

		try {
			result = sqlSession.selectList("modelOrthoDataMapper.selectModelOrthoDatas", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertModelOrthoData(ModelOrthoData modelOrthoData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("modelOrthoDataMapper.insertModelOrthoData", modelOrthoData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertModelOrthoDatas(List<ModelOrthoData> modelOrthoDatas, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("modelOrthoDataMapper.insertModelOrthoDatas", modelOrthoDatas);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateModelOrthoData(ModelOrthoData modelOrthoData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("modelOrthoDataMapper.updateModelOrthoData", modelOrthoData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateModelOrthoData(Map<ModelOrthoData.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateModelOrthoData(params, errorMessage);
	}

	public boolean updateModelOrthoData(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("modelOrthoDataMapper.updateModelOrthoDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteModelOrthoData(ModelOrthoData modelOrthoData, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("modelOrthoDataMapper.deleteModelOrthoData", modelOrthoData);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteModelOrthoData(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("modelOrthoDataMapper.deleteModelOrthoDataByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

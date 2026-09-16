package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.Material;
import egovframework.base.generic.Holder;

@Repository
public class MaterialDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Material> selectMaterials(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Material> result = null;

		try {
			result = sqlSession.selectList("materialMapper.selectMaterials", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Material selectMaterial(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Material> result = null;

		try {
			result = sqlSession.selectList("materialMapper.selectMaterials", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertMaterial(Material material, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialMapper.insertMaterial", material);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertMaterials(List<Material> materials, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("materialMapper.insertMaterials", materials);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterial(Material material, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialMapper.updateMaterial", material);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateMaterial(Map<Material.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateMaterial(params, errorMessage);
	}

	public boolean updateMaterial(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("materialMapper.updateMaterialByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterial(Material material, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("materialMapper.deleteMaterial", material);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteMaterial(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("materialMapper.deleteMaterialByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

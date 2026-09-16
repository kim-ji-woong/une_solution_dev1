package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.EquipmentZone;
import egovframework.base.generic.Holder;

@Repository
public class EquipmentZoneDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<EquipmentZone> selectEquipmentZones(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<EquipmentZone> result = null;

		try {
			result = sqlSession.selectList("equipmentZoneMapper.selectEquipmentZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public EquipmentZone selectEquipmentZone(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<EquipmentZone> result = null;

		try {
			result = sqlSession.selectList("equipmentZoneMapper.selectEquipmentZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertEquipmentZone(EquipmentZone equipmentZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipmentZoneMapper.insertEquipmentZone", equipmentZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertEquipmentZones(List<EquipmentZone> equipmentZones, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipmentZoneMapper.insertEquipmentZones", equipmentZones);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipmentZone(EquipmentZone equipmentZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipmentZoneMapper.updateEquipmentZone", equipmentZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipmentZone(Map<EquipmentZone.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateEquipmentZone(params, errorMessage);
	}

	public boolean updateEquipmentZone(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipmentZoneMapper.updateEquipmentZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipmentZone(EquipmentZone equipmentZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("equipmentZoneMapper.deleteEquipmentZone", equipmentZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipmentZone(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("equipmentZoneMapper.deleteEquipmentZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.EquipmentZoneLinkedZone;
import egovframework.base.generic.Holder;

@Repository
public class EquipmentZoneLinkedZoneDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<EquipmentZoneLinkedZone> selectEquipmentZoneLinkedZones(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<EquipmentZoneLinkedZone> result = null;

		try {
			result = sqlSession.selectList("equipmentZoneLinkedZoneMapper.selectEquipmentZoneLinkedZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public EquipmentZoneLinkedZone selectEquipmentZoneLinkedZone(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<EquipmentZoneLinkedZone> result = null;

		try {
			result = sqlSession.selectList("equipmentZoneLinkedZoneMapper.selectEquipmentZoneLinkedZones", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertEquipmentZoneLinkedZone(EquipmentZoneLinkedZone equipmentZoneLinkedZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipmentZoneLinkedZoneMapper.insertEquipmentZoneLinkedZone", equipmentZoneLinkedZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertEquipmentZoneLinkedZones(List<EquipmentZoneLinkedZone> equipmentZoneLinkedZones, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipmentZoneLinkedZoneMapper.insertEquipmentZoneLinkedZones", equipmentZoneLinkedZones);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipmentZoneLinkedZone(EquipmentZoneLinkedZone equipmentZoneLinkedZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipmentZoneLinkedZoneMapper.updateEquipmentZoneLinkedZone", equipmentZoneLinkedZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipmentZoneLinkedZone(Map<EquipmentZoneLinkedZone.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateEquipmentZoneLinkedZone(params, errorMessage);
	}

	public boolean updateEquipmentZoneLinkedZone(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipmentZoneLinkedZoneMapper.updateEquipmentZoneLinkedZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipmentZoneLinkedZone(EquipmentZoneLinkedZone equipmentZoneLinkedZone, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("equipmentZoneLinkedZoneMapper.deleteEquipmentZoneLinkedZone", equipmentZoneLinkedZone);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipmentZoneLinkedZone(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("equipmentZoneLinkedZoneMapper.deleteEquipmentZoneLinkedZoneByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

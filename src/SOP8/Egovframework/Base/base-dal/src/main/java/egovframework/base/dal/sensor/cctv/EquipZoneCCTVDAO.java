package egovframework.base.dal.sensor.cctv;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.cctv.EquipZoneCCTV;
import egovframework.base.generic.Holder;

@Repository
public class EquipZoneCCTVDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<EquipZoneCCTV> selectEquipZoneCCTVs(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<EquipZoneCCTV> result = null;

		try {
			result = sqlSession.selectList("equipZoneCCTVMapper.selectEquipZoneCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public EquipZoneCCTV selectEquipZoneCCTV(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<EquipZoneCCTV> result = null;

		try {
			result = sqlSession.selectList("equipZoneCCTVMapper.selectEquipZoneCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertEquipZoneCCTV(EquipZoneCCTV equipZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipZoneCCTVMapper.insertEquipZoneCCTV", equipZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertEquipZoneCCTVs(List<EquipZoneCCTV> equipZoneCCTVs, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("equipZoneCCTVMapper.insertEquipZoneCCTVs", equipZoneCCTVs);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipZoneCCTV(EquipZoneCCTV equipZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipZoneCCTVMapper.updateEquipZoneCCTV", equipZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEquipZoneCCTV(Map<EquipZoneCCTV.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateEquipZoneCCTV(params, errorMessage);
	}

	public boolean updateEquipZoneCCTV(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("equipZoneCCTVMapper.updateEquipZoneCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipZoneCCTV(EquipZoneCCTV equipZoneCCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("equipZoneCCTVMapper.deleteEquipZoneCCTV", equipZoneCCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEquipZoneCCTV(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("equipZoneCCTVMapper.deleteEquipZoneCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

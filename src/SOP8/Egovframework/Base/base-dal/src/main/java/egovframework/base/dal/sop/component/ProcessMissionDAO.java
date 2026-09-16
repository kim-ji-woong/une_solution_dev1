package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.ProcessMission;
import egovframework.base.generic.Holder;

@Repository
public class ProcessMissionDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ProcessMission> selectProcessMissions(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ProcessMission> result = null;

		try {
			result = sqlSession.selectList("processMissionMapper.selectProcessMissions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ProcessMission selectProcessMission(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ProcessMission> result = null;

		try {
			result = sqlSession.selectList("processMissionMapper.selectProcessMissions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertProcessMission(ProcessMission processMission, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processMissionMapper.insertProcessMission", processMission);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertProcessMissions(List<ProcessMission> processMissions, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processMissionMapper.insertProcessMissions", processMissions);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessMission(ProcessMission processMission, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processMissionMapper.updateProcessMission", processMission);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessMission(Map<ProcessMission.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateProcessMission(params, errorMessage);
	}

	public boolean updateProcessMission(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processMissionMapper.updateProcessMissionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessMission(ProcessMission processMission, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("processMissionMapper.deleteProcessMission", processMission);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessMission(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("processMissionMapper.deleteProcessMissionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

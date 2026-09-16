package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.ActionStep;
import egovframework.base.generic.Holder;

@Repository
public class ActionStepDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ActionStep> selectActionSteps(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ActionStep> result = null;

		try {
			result = sqlSession.selectList("actionStepMapper.selectActionSteps", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ActionStep selectActionStep(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ActionStep> result = null;

		try {
			result = sqlSession.selectList("actionStepMapper.selectActionSteps", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertActionStep(ActionStep actionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("actionStepMapper.insertActionStep", actionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertActionSteps(List<ActionStep> actionSteps, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("actionStepMapper.insertActionSteps", actionSteps);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateActionStep(ActionStep actionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("actionStepMapper.updateActionStep", actionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateActionStep(Map<ActionStep.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateActionStep(params, errorMessage);
	}

	public boolean updateActionStep(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("actionStepMapper.updateActionStepByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteActionStep(ActionStep actionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("actionStepMapper.deleteActionStep", actionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteActionStep(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("actionStepMapper.deleteActionStepByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

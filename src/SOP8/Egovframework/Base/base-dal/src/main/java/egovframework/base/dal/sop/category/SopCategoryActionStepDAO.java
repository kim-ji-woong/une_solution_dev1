package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.SopCategoryActionStep;
import egovframework.base.generic.Holder;

@Repository
public class SopCategoryActionStepDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SopCategoryActionStep> selectSopCategoryActionSteps(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SopCategoryActionStep> result = null;

		try {
			result = sqlSession.selectList("sopCategoryActionStepMapper.selectSopCategoryActionSteps", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SopCategoryActionStep selectSopCategoryActionStep(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SopCategoryActionStep> result = null;

		try {
			result = sqlSession.selectList("sopCategoryActionStepMapper.selectSopCategoryActionSteps", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSopCategoryActionStep(SopCategoryActionStep sopCategoryActionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sopCategoryActionStepMapper.insertSopCategoryActionStep", sopCategoryActionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSopCategoryActionSteps(List<SopCategoryActionStep> sopCategoryActionSteps, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sopCategoryActionStepMapper.insertSopCategoryActionSteps", sopCategoryActionSteps);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSopCategoryActionStep(SopCategoryActionStep sopCategoryActionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sopCategoryActionStepMapper.updateSopCategoryActionStep", sopCategoryActionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSopCategoryActionStep(Map<SopCategoryActionStep.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSopCategoryActionStep(params, errorMessage);
	}

	public boolean updateSopCategoryActionStep(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sopCategoryActionStepMapper.updateSopCategoryActionStepByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSopCategoryActionStep(SopCategoryActionStep sopCategoryActionStep, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sopCategoryActionStepMapper.deleteSopCategoryActionStep", sopCategoryActionStep);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSopCategoryActionStep(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sopCategoryActionStepMapper.deleteSopCategoryActionStepByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

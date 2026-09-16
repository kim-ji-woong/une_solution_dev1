package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.ProcessRegular;
import egovframework.base.generic.Holder;

@Repository
public class ProcessRegularDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ProcessRegular> selectProcessRegulars(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ProcessRegular> result = null;

		try {
			result = sqlSession.selectList("processRegularMapper.selectProcessRegulars", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ProcessRegular selectProcessRegular(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ProcessRegular> result = null;

		try {
			result = sqlSession.selectList("processRegularMapper.selectProcessRegulars", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertProcessRegular(ProcessRegular processRegular, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processRegularMapper.insertProcessRegular", processRegular);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertProcessRegulars(List<ProcessRegular> processRegulars, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processRegularMapper.insertProcessRegulars", processRegulars);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessRegular(ProcessRegular processRegular, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processRegularMapper.updateProcessRegular", processRegular);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessRegular(Map<ProcessRegular.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateProcessRegular(params, errorMessage);
	}

	public boolean updateProcessRegular(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processRegularMapper.updateProcessRegularByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessRegular(ProcessRegular processRegular, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("processRegularMapper.deleteProcessRegular", processRegular);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessRegular(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("processRegularMapper.deleteProcessRegularByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

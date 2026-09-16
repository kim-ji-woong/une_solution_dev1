package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.ProcessTemporary;
import egovframework.base.generic.Holder;

@Repository
public class ProcessTemporaryDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ProcessTemporary> selectProcessTemporaries(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ProcessTemporary> result = null;

		try {
			result = sqlSession.selectList("processTemporaryMapper.selectProcessTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ProcessTemporary selectProcessTemporary(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ProcessTemporary> result = null;

		try {
			result = sqlSession.selectList("processTemporaryMapper.selectProcessTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertProcessTemporary(ProcessTemporary processTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processTemporaryMapper.insertProcessTemporary", processTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertProcessTemporaries(List<ProcessTemporary> processTemporaries, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("processTemporaryMapper.insertProcessTemporaries", processTemporaries);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessTemporary(ProcessTemporary processTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processTemporaryMapper.updateProcessTemporary", processTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateProcessTemporary(Map<ProcessTemporary.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateProcessTemporary(params, errorMessage);
	}

	public boolean updateProcessTemporary(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("processTemporaryMapper.updateProcessTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessTemporary(ProcessTemporary processTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("processTemporaryMapper.deleteProcessTemporary", processTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteProcessTemporary(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("processTemporaryMapper.deleteProcessTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

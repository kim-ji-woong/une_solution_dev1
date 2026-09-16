package egovframework.base.dal.common.team;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.common.team.Temporary;
import egovframework.base.generic.Holder;

@Repository
public class TemporaryDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Temporary> selectTemporaries(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Temporary> result = null;

		try {
			result = sqlSession.selectList("temporaryMapper.selectTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Temporary selectTemporary(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Temporary> result = null;

		try {
			result = sqlSession.selectList("temporaryMapper.selectTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertTemporary(Temporary temporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("temporaryMapper.insertTemporary", temporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertTemporaries(List<Temporary> temporaries, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("temporaryMapper.insertTemporaries", temporaries);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateTemporary(Temporary temporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("temporaryMapper.updateTemporary", temporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateTemporary(Map<Temporary.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateTemporary(params, errorMessage);
	}

	public boolean updateTemporary(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("temporaryMapper.updateTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteTemporary(Temporary temporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("temporaryMapper.deleteTemporary", temporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteTemporary(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("temporaryMapper.deleteTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

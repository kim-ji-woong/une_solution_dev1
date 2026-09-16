package egovframework.base.dal.sop.config;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.config.LinkedSop;
import egovframework.base.generic.Holder;

@Repository
public class LinkedSopDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<LinkedSop> selectLinkedSops(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<LinkedSop> result = null;

		try {
			result = sqlSession.selectList("linkedSopMapper.selectLinkedSops", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public LinkedSop selectLinkedSop(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<LinkedSop> result = null;

		try {
			result = sqlSession.selectList("linkedSopMapper.selectLinkedSops", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertLinkedSop(LinkedSop linkedSop, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("linkedSopMapper.insertLinkedSop", linkedSop);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertLinkedSops(List<LinkedSop> linkedSops, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("linkedSopMapper.insertLinkedSops", linkedSops);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateLinkedSop(LinkedSop linkedSop, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("linkedSopMapper.updateLinkedSop", linkedSop);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateLinkedSop(Map<LinkedSop.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateLinkedSop(params, errorMessage);
	}

	public boolean updateLinkedSop(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("linkedSopMapper.updateLinkedSopByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteLinkedSop(LinkedSop linkedSop, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("linkedSopMapper.deleteLinkedSop", linkedSop);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteLinkedSop(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("linkedSopMapper.deleteLinkedSopByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

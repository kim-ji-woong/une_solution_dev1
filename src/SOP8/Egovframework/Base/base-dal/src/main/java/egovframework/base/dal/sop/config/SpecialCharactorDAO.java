package egovframework.base.dal.sop.config;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.config.SpecialCharactor;
import egovframework.base.generic.Holder;

@Repository
public class SpecialCharactorDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SpecialCharactor> selectSpecialCharactors(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SpecialCharactor> result = null;

		try {
			result = sqlSession.selectList("specialCharactorMapper.selectSpecialCharactors", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SpecialCharactor selectSpecialCharactor(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SpecialCharactor> result = null;

		try {
			result = sqlSession.selectList("specialCharactorMapper.selectSpecialCharactors", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSpecialCharactor(SpecialCharactor specialCharactor, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("specialCharactorMapper.insertSpecialCharactor", specialCharactor);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSpecialCharactors(List<SpecialCharactor> specialCharactors, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("specialCharactorMapper.insertSpecialCharactors", specialCharactors);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSpecialCharactor(SpecialCharactor specialCharactor, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("specialCharactorMapper.updateSpecialCharactor", specialCharactor);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSpecialCharactor(Map<SpecialCharactor.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSpecialCharactor(params, errorMessage);
	}

	public boolean updateSpecialCharactor(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("specialCharactorMapper.updateSpecialCharactorByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSpecialCharactor(SpecialCharactor specialCharactor, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("specialCharactorMapper.deleteSpecialCharactor", specialCharactor);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSpecialCharactor(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("specialCharactorMapper.deleteSpecialCharactorByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

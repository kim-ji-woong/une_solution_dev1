package egovframework.base.dal.common;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.common.CommonOption;
import egovframework.base.generic.Holder;

@Repository
public class CommonOptionDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<CommonOption> selectCommonOptions(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<CommonOption> result = null;

		try {
			result = sqlSession.selectList("commonOptionMapper.selectCommonOptions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public CommonOption selectCommonOption(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<CommonOption> result = null;

		try {
			result = sqlSession.selectList("commonOptionMapper.selectCommonOptions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertCommonOption(CommonOption commonOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("commonOptionMapper.insertCommonOption", commonOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertCommonOptions(List<CommonOption> commonOptions, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("commonOptionMapper.insertCommonOptions", commonOptions);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCommonOption(CommonOption commonOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("commonOptionMapper.updateCommonOption", commonOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCommonOption(Map<CommonOption.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateCommonOption(params, errorMessage);
	}

	public boolean updateCommonOption(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("commonOptionMapper.updateCommonOptionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCommonOption(CommonOption commonOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("commonOptionMapper.deleteCommonOption", commonOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCommonOption(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("commonOptionMapper.deleteCommonOptionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

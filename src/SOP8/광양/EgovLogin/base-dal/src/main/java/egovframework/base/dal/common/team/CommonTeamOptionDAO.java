package egovframework.base.dal.common.team;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.common.team.CommonTeamOption;
import egovframework.base.generic.Holder;

@Repository
public class CommonTeamOptionDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<CommonTeamOption> selectCommonTeamOptions(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<CommonTeamOption> result = null;

		try {
			result = sqlSession.selectList("commonTeamOptionMapper.selectCommonTeamOptions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public CommonTeamOption selectCommonTeamOption(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<CommonTeamOption> result = null;

		try {
			result = sqlSession.selectList("commonTeamOptionMapper.selectCommonTeamOptions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertCommonTeamOption(CommonTeamOption commonTeamOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("commonTeamOptionMapper.insertCommonTeamOption", commonTeamOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertCommonTeamOptions(List<CommonTeamOption> commonTeamOptions, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("commonTeamOptionMapper.insertCommonTeamOptions", commonTeamOptions);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCommonTeamOption(CommonTeamOption commonTeamOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("commonTeamOptionMapper.updateCommonTeamOption", commonTeamOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCommonTeamOption(Map<CommonTeamOption.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateCommonTeamOption(params, errorMessage);
	}

	public boolean updateCommonTeamOption(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("commonTeamOptionMapper.updateCommonTeamOptionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCommonTeamOption(CommonTeamOption commonTeamOption, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("commonTeamOptionMapper.deleteCommonTeamOption", commonTeamOption);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCommonTeamOption(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("commonTeamOptionMapper.deleteCommonTeamOptionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.common.team;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.common.team.RegularMember;
import egovframework.base.generic.Holder;

@Repository
public class RegularMemberDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<RegularMember> selectRegularMembers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<RegularMember> result = null;

		try {
			result = sqlSession.selectList("regularMemberMapper.selectRegularMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public RegularMember selectRegularMember(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<RegularMember> result = null;

		try {
			result = sqlSession.selectList("regularMemberMapper.selectRegularMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertRegularMember(RegularMember regularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("regularMemberMapper.insertRegularMember", regularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertRegularMembers(List<RegularMember> regularMembers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("regularMemberMapper.insertRegularMembers", regularMembers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateRegularMember(RegularMember regularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("regularMemberMapper.updateRegularMember", regularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateRegularMember(Map<RegularMember.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateRegularMember(params, errorMessage);
	}

	public boolean updateRegularMember(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("regularMemberMapper.updateRegularMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteRegularMember(RegularMember regularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("regularMemberMapper.deleteRegularMember", regularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteRegularMember(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("regularMemberMapper.deleteRegularMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

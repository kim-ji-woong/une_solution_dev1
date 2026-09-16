package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.FacilityManagerRegularMember;
import egovframework.base.generic.Holder;

@Repository
public class FacilityManagerRegularMemberDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<FacilityManagerRegularMember> selectFacilityManagerRegularMembers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<FacilityManagerRegularMember> result = null;

		try {
			result = sqlSession.selectList("facilityManagerRegularMemberMapper.selectFacilityManagerRegularMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public FacilityManagerRegularMember selectFacilityManagerRegularMember(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<FacilityManagerRegularMember> result = null;

		try {
			result = sqlSession.selectList("facilityManagerRegularMemberMapper.selectFacilityManagerRegularMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertFacilityManagerRegularMember(FacilityManagerRegularMember facilityManagerRegularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerRegularMemberMapper.insertFacilityManagerRegularMember", facilityManagerRegularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertFacilityManagerRegularMembers(List<FacilityManagerRegularMember> facilityManagerRegularMembers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerRegularMemberMapper.insertFacilityManagerRegularMembers", facilityManagerRegularMembers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerRegularMember(FacilityManagerRegularMember facilityManagerRegularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerRegularMemberMapper.updateFacilityManagerRegularMember", facilityManagerRegularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerRegularMember(Map<FacilityManagerRegularMember.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateFacilityManagerRegularMember(params, errorMessage);
	}

	public boolean updateFacilityManagerRegularMember(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerRegularMemberMapper.updateFacilityManagerRegularMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerRegularMember(FacilityManagerRegularMember facilityManagerRegularMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("facilityManagerRegularMemberMapper.deleteFacilityManagerRegularMember", facilityManagerRegularMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerRegularMember(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("facilityManagerRegularMemberMapper.deleteFacilityManagerRegularMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.FacilityManagerTemporaryMember;
import egovframework.base.generic.Holder;

@Repository
public class FacilityManagerTemporaryMemberDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<FacilityManagerTemporaryMember> selectFacilityManagerTemporaryMembers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<FacilityManagerTemporaryMember> result = null;

		try {
			result = sqlSession.selectList("facilityManagerTemporaryMemberMapper.selectFacilityManagerTemporaryMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public FacilityManagerTemporaryMember selectFacilityManagerTemporaryMember(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<FacilityManagerTemporaryMember> result = null;

		try {
			result = sqlSession.selectList("facilityManagerTemporaryMemberMapper.selectFacilityManagerTemporaryMembers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertFacilityManagerTemporaryMember(FacilityManagerTemporaryMember facilityManagerTemporaryMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerTemporaryMemberMapper.insertFacilityManagerTemporaryMember", facilityManagerTemporaryMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertFacilityManagerTemporaryMembers(List<FacilityManagerTemporaryMember> facilityManagerTemporaryMembers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("facilityManagerTemporaryMemberMapper.insertFacilityManagerTemporaryMembers", facilityManagerTemporaryMembers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerTemporaryMember(FacilityManagerTemporaryMember facilityManagerTemporaryMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerTemporaryMemberMapper.updateFacilityManagerTemporaryMember", facilityManagerTemporaryMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFacilityManagerTemporaryMember(Map<FacilityManagerTemporaryMember.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateFacilityManagerTemporaryMember(params, errorMessage);
	}

	public boolean updateFacilityManagerTemporaryMember(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("facilityManagerTemporaryMemberMapper.updateFacilityManagerTemporaryMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerTemporaryMember(FacilityManagerTemporaryMember facilityManagerTemporaryMember, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("facilityManagerTemporaryMemberMapper.deleteFacilityManagerTemporaryMember", facilityManagerTemporaryMember);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFacilityManagerTemporaryMember(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("facilityManagerTemporaryMemberMapper.deleteFacilityManagerTemporaryMemberByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

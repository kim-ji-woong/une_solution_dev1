package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.Version;
import egovframework.base.generic.Holder;

@Repository
public class VersionDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Version> selectVersions(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Version> result = null;

		try {
			result = sqlSession.selectList("versionMapper.selectVersions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Version selectVersion(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Version> result = null;

		try {
			result = sqlSession.selectList("versionMapper.selectVersions", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertVersion(Version version, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("versionMapper.insertVersion", version);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertVersions(List<Version> versions, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("versionMapper.insertVersions", versions);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateVersion(Version version, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("versionMapper.updateVersion", version);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateVersion(Map<Version.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateVersion(params, errorMessage);
	}

	public boolean updateVersion(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("versionMapper.updateVersionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteVersion(Version version, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("versionMapper.deleteVersion", version);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteVersion(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("versionMapper.deleteVersionByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

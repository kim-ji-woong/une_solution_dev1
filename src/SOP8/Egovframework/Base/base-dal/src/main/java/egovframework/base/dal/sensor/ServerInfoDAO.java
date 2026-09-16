package egovframework.base.dal.sensor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.ServerInfo;
import egovframework.base.generic.Holder;

@Repository
public class ServerInfoDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ServerInfo> selectServerInfos(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ServerInfo> result = null;

		try {
			result = sqlSession.selectList("serverInfoMapper.selectServerInfos", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ServerInfo selectServerInfo(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ServerInfo> result = null;

		try {
			result = sqlSession.selectList("serverInfoMapper.selectServerInfos", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertServerInfo(ServerInfo serverInfo, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("serverInfoMapper.insertServerInfo", serverInfo);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertServerInfos(List<ServerInfo> serverInfos, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("serverInfoMapper.insertServerInfos", serverInfos);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateServerInfo(ServerInfo serverInfo, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("serverInfoMapper.updateServerInfo", serverInfo);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateServerInfo(Map<ServerInfo.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateServerInfo(params, errorMessage);
	}

	public boolean updateServerInfo(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("serverInfoMapper.updateServerInfoByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteServerInfo(ServerInfo serverInfo, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("serverInfoMapper.deleteServerInfo", serverInfo);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteServerInfo(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("serverInfoMapper.deleteServerInfoByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

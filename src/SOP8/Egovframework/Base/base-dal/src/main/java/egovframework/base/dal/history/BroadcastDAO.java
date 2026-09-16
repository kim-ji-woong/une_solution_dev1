package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.Broadcast;
import egovframework.base.generic.Holder;

@Repository
public class BroadcastDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Broadcast> selectBroadcasts(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Broadcast> result = null;

		try {
			result = sqlSession.selectList("broadcastMapper.selectBroadcasts", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Broadcast selectBroadcast(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Broadcast> result = null;

		try {
			result = sqlSession.selectList("broadcastMapper.selectBroadcasts", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertBroadcast(Broadcast broadcast, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("broadcastMapper.insertBroadcast", broadcast);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertBroadcasts(List<Broadcast> broadcasts, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("broadcastMapper.insertBroadcasts", broadcasts);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBroadcast(Broadcast broadcast, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("broadcastMapper.updateBroadcast", broadcast);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateBroadcast(Map<Broadcast.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateBroadcast(params, errorMessage);
	}

	public boolean updateBroadcast(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("broadcastMapper.updateBroadcastByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBroadcast(Broadcast broadcast, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("broadcastMapper.deleteBroadcast", broadcast);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteBroadcast(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("broadcastMapper.deleteBroadcastByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

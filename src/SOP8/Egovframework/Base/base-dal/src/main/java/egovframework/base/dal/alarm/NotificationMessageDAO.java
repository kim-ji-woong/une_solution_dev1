package egovframework.base.dal.alarm;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.alarm.NotificationMessage;
import egovframework.base.generic.Holder;

@Repository
public class NotificationMessageDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<NotificationMessage> selectNotificationMessages(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<NotificationMessage> result = null;

		try {
			result = sqlSession.selectList("notificationMessageMapper.selectNotificationMessages", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public NotificationMessage selectNotificationMessage(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<NotificationMessage> result = null;

		try {
			result = sqlSession.selectList("notificationMessageMapper.selectNotificationMessages", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertNotificationMessage(NotificationMessage notificationMessage, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("notificationMessageMapper.insertNotificationMessage", notificationMessage);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertNotificationMessages(List<NotificationMessage> notificationMessages, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("notificationMessageMapper.insertNotificationMessages", notificationMessages);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateNotificationMessage(NotificationMessage notificationMessage, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("notificationMessageMapper.updateNotificationMessage", notificationMessage);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateNotificationMessage(Map<NotificationMessage.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateNotificationMessage(params, errorMessage);
	}

	public boolean updateNotificationMessage(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("notificationMessageMapper.updateNotificationMessageByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteNotificationMessage(NotificationMessage notificationMessage, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("notificationMessageMapper.deleteNotificationMessage", notificationMessage);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteNotificationMessage(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("notificationMessageMapper.deleteNotificationMessageByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

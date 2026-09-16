package egovframework.base.dal.alarm;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.alarm.NotificationMessageReceiver;
import egovframework.base.generic.Holder;

@Repository
public class NotificationMessageReceiverDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<NotificationMessageReceiver> selectNotificationMessageReceivers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<NotificationMessageReceiver> result = null;

		try {
			result = sqlSession.selectList("notificationMessageReceiverMapper.selectNotificationMessageReceivers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public NotificationMessageReceiver selectNotificationMessageReceiver(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<NotificationMessageReceiver> result = null;

		try {
			result = sqlSession.selectList("notificationMessageReceiverMapper.selectNotificationMessageReceivers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertNotificationMessageReceiver(NotificationMessageReceiver notificationMessageReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("notificationMessageReceiverMapper.insertNotificationMessageReceiver", notificationMessageReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertNotificationMessageReceivers(List<NotificationMessageReceiver> notificationMessageReceivers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("notificationMessageReceiverMapper.insertNotificationMessageReceivers", notificationMessageReceivers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateNotificationMessageReceiver(NotificationMessageReceiver notificationMessageReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("notificationMessageReceiverMapper.updateNotificationMessageReceiver", notificationMessageReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateNotificationMessageReceiver(Map<NotificationMessageReceiver.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateNotificationMessageReceiver(params, errorMessage);
	}

	public boolean updateNotificationMessageReceiver(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("notificationMessageReceiverMapper.updateNotificationMessageReceiverByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteNotificationMessageReceiver(NotificationMessageReceiver notificationMessageReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("notificationMessageReceiverMapper.deleteNotificationMessageReceiver", notificationMessageReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteNotificationMessageReceiver(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("notificationMessageReceiverMapper.deleteNotificationMessageReceiverByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.SMSReceiver;
import egovframework.base.generic.Holder;

@Repository
public class SMSReceiverDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SMSReceiver> selectSMSReceivers(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SMSReceiver> result = null;

		try {
			result = sqlSession.selectList("sMSReceiverMapper.selectSMSReceivers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SMSReceiver selectSMSReceiver(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SMSReceiver> result = null;

		try {
			result = sqlSession.selectList("sMSReceiverMapper.selectSMSReceivers", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSMSReceiver(SMSReceiver sMSReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sMSReceiverMapper.insertSMSReceiver", sMSReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSMSReceivers(List<SMSReceiver> sMSReceivers, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sMSReceiverMapper.insertSMSReceivers", sMSReceivers);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSMSReceiver(SMSReceiver sMSReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sMSReceiverMapper.updateSMSReceiver", sMSReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSMSReceiver(Map<SMSReceiver.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSMSReceiver(params, errorMessage);
	}

	public boolean updateSMSReceiver(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sMSReceiverMapper.updateSMSReceiverByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSMSReceiver(SMSReceiver sMSReceiver, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sMSReceiverMapper.deleteSMSReceiver", sMSReceiver);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSMSReceiver(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sMSReceiverMapper.deleteSMSReceiverByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

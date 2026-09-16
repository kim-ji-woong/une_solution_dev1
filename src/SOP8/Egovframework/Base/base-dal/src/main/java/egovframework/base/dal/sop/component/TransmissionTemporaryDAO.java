package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.TransmissionTemporary;
import egovframework.base.generic.Holder;

@Repository
public class TransmissionTemporaryDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<TransmissionTemporary> selectTransmissionTemporaries(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<TransmissionTemporary> result = null;

		try {
			result = sqlSession.selectList("transmissionTemporaryMapper.selectTransmissionTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public TransmissionTemporary selectTransmissionTemporary(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<TransmissionTemporary> result = null;

		try {
			result = sqlSession.selectList("transmissionTemporaryMapper.selectTransmissionTemporaries", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertTransmissionTemporary(TransmissionTemporary transmissionTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("transmissionTemporaryMapper.insertTransmissionTemporary", transmissionTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertTransmissionTemporaries(List<TransmissionTemporary> transmissionTemporaries, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("transmissionTemporaryMapper.insertTransmissionTemporaries", transmissionTemporaries);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateTransmissionTemporary(TransmissionTemporary transmissionTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("transmissionTemporaryMapper.updateTransmissionTemporary", transmissionTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateTransmissionTemporary(Map<TransmissionTemporary.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateTransmissionTemporary(params, errorMessage);
	}

	public boolean updateTransmissionTemporary(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("transmissionTemporaryMapper.updateTransmissionTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteTransmissionTemporary(TransmissionTemporary transmissionTemporary, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("transmissionTemporaryMapper.deleteTransmissionTemporary", transmissionTemporary);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteTransmissionTemporary(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("transmissionTemporaryMapper.deleteTransmissionTemporaryByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

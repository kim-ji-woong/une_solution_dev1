package egovframework.base.dal.history;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.history.ComponentDetail;
import egovframework.base.generic.Holder;

@Repository
public class ComponentDetailDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<ComponentDetail> selectComponentDetails(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<ComponentDetail> result = null;

		try {
			result = sqlSession.selectList("componentDetailMapper.selectComponentDetails", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public ComponentDetail selectComponentDetail(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<ComponentDetail> result = null;

		try {
			result = sqlSession.selectList("componentDetailMapper.selectComponentDetails", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertComponentDetail(ComponentDetail componentDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("componentDetailMapper.insertComponentDetail", componentDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertComponentDetails(List<ComponentDetail> componentDetails, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("componentDetailMapper.insertComponentDetails", componentDetails);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateComponentDetail(ComponentDetail componentDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("componentDetailMapper.updateComponentDetail", componentDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateComponentDetail(Map<ComponentDetail.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateComponentDetail(params, errorMessage);
	}

	public boolean updateComponentDetail(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("componentDetailMapper.updateComponentDetailByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteComponentDetail(ComponentDetail componentDetail, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("componentDetailMapper.deleteComponentDetail", componentDetail);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteComponentDetail(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("componentDetailMapper.deleteComponentDetailByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

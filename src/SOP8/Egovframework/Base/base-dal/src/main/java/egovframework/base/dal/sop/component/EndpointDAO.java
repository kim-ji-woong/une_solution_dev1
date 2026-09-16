package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.Endpoint;
import egovframework.base.generic.Holder;

@Repository
public class EndpointDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Endpoint> selectEndpoints(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Endpoint> result = null;

		try {
			result = sqlSession.selectList("endpointMapper.selectEndpoints", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Endpoint selectEndpoint(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Endpoint> result = null;

		try {
			result = sqlSession.selectList("endpointMapper.selectEndpoints", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertEndpoint(Endpoint endpoint, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("endpointMapper.insertEndpoint", endpoint);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertEndpoints(List<Endpoint> endpoints, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("endpointMapper.insertEndpoints", endpoints);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEndpoint(Endpoint endpoint, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("endpointMapper.updateEndpoint", endpoint);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateEndpoint(Map<Endpoint.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateEndpoint(params, errorMessage);
	}

	public boolean updateEndpoint(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("endpointMapper.updateEndpointByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEndpoint(Endpoint endpoint, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("endpointMapper.deleteEndpoint", endpoint);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteEndpoint(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("endpointMapper.deleteEndpointByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.SopComponentComponent;
import egovframework.base.generic.Holder;

@Repository
public class SopComponentComponentDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SopComponentComponent> selectSopComponentComponents(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SopComponentComponent> result = null;

		try {
			result = sqlSession.selectList("sopComponentComponentMapper.selectSopComponentComponents", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SopComponentComponent selectSopComponentComponent(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SopComponentComponent> result = null;

		try {
			result = sqlSession.selectList("sopComponentComponentMapper.selectSopComponentComponents", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSopComponentComponent(SopComponentComponent sopComponentComponent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sopComponentComponentMapper.insertSopComponentComponent", sopComponentComponent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSopComponentComponents(List<SopComponentComponent> sopComponentComponents, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("sopComponentComponentMapper.insertSopComponentComponents", sopComponentComponents);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSopComponentComponent(SopComponentComponent sopComponentComponent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sopComponentComponentMapper.updateSopComponentComponent", sopComponentComponent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSopComponentComponent(Map<SopComponentComponent.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSopComponentComponent(params, errorMessage);
	}

	public boolean updateSopComponentComponent(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("sopComponentComponentMapper.updateSopComponentComponentByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSopComponentComponent(SopComponentComponent sopComponentComponent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("sopComponentComponentMapper.deleteSopComponentComponent", sopComponentComponent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSopComponentComponent(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("sopComponentComponentMapper.deleteSopComponentComponentByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

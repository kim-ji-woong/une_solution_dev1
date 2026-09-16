package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.GridColumn;
import egovframework.base.generic.Holder;

@Repository
public class GridColumnDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<GridColumn> selectGridColumns(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<GridColumn> result = null;

		try {
			result = sqlSession.selectList("gridColumnMapper.selectGridColumns", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public GridColumn selectGridColumn(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<GridColumn> result = null;

		try {
			result = sqlSession.selectList("gridColumnMapper.selectGridColumns", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertGridColumn(GridColumn gridColumn, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("gridColumnMapper.insertGridColumn", gridColumn);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertGridColumns(List<GridColumn> gridColumns, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("gridColumnMapper.insertGridColumns", gridColumns);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateGridColumn(GridColumn gridColumn, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("gridColumnMapper.updateGridColumn", gridColumn);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateGridColumn(Map<GridColumn.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateGridColumn(params, errorMessage);
	}

	public boolean updateGridColumn(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("gridColumnMapper.updateGridColumnByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteGridColumn(GridColumn gridColumn, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("gridColumnMapper.deleteGridColumn", gridColumn);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteGridColumn(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("gridColumnMapper.deleteGridColumnByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

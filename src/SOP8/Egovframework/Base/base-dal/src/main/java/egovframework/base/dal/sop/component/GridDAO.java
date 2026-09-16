package egovframework.base.dal.sop.component;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.component.Grid;
import egovframework.base.generic.Holder;

@Repository
public class GridDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<Grid> selectGrids(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<Grid> result = null;

		try {
			result = sqlSession.selectList("gridMapper.selectGrids", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public Grid selectGrid(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<Grid> result = null;

		try {
			result = sqlSession.selectList("gridMapper.selectGrids", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertGrid(Grid grid, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("gridMapper.insertGrid", grid);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertGrids(List<Grid> grids, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("gridMapper.insertGrids", grids);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateGrid(Grid grid, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("gridMapper.updateGrid", grid);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateGrid(Map<Grid.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateGrid(params, errorMessage);
	}

	public boolean updateGrid(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("gridMapper.updateGridByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteGrid(Grid grid, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("gridMapper.deleteGrid", grid);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteGrid(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("gridMapper.deleteGridByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

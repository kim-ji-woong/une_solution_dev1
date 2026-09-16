package egovframework.base.dal.spatial;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.spatial.FakeWall;
import egovframework.base.generic.Holder;

@Repository
public class FakeWallDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<FakeWall> selectFakeWalls(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<FakeWall> result = null;

		try {
			result = sqlSession.selectList("fakeWallMapper.selectFakeWalls", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public FakeWall selectFakeWall(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<FakeWall> result = null;

		try {
			result = sqlSession.selectList("fakeWallMapper.selectFakeWalls", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertFakeWall(FakeWall fakeWall, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("fakeWallMapper.insertFakeWall", fakeWall);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertFakeWalls(List<FakeWall> fakeWalls, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("fakeWallMapper.insertFakeWalls", fakeWalls);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFakeWall(FakeWall fakeWall, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("fakeWallMapper.updateFakeWall", fakeWall);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateFakeWall(Map<FakeWall.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateFakeWall(params, errorMessage);
	}

	public boolean updateFakeWall(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("fakeWallMapper.updateFakeWallByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFakeWall(FakeWall fakeWall, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("fakeWallMapper.deleteFakeWall", fakeWall);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteFakeWall(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("fakeWallMapper.deleteFakeWallByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

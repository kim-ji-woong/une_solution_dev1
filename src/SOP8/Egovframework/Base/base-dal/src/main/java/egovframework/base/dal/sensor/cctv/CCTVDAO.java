package egovframework.base.dal.sensor.cctv;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sensor.cctv.CCTV;
import egovframework.base.generic.Holder;

@Repository
public class CCTVDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<CCTV> selectCCTVs(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<CCTV> result = null;

		try {
			result = sqlSession.selectList("cCTVMapper.selectCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public CCTV selectCCTV(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<CCTV> result = null;

		try {
			result = sqlSession.selectList("cCTVMapper.selectCCTVs", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertCCTV(CCTV cCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("cCTVMapper.insertCCTV", cCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertCCTVs(List<CCTV> cCTVs, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("cCTVMapper.insertCCTVs", cCTVs);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCCTV(CCTV cCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("cCTVMapper.updateCCTV", cCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateCCTV(Map<CCTV.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateCCTV(params, errorMessage);
	}

	public boolean updateCCTV(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("cCTVMapper.updateCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCCTV(CCTV cCTV, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("cCTVMapper.deleteCCTV", cCTV);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteCCTV(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("cCTVMapper.deleteCCTVByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

package egovframework.base.dal.sop.category;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.sop.category.SmallClassUserGrade;
import egovframework.base.generic.Holder;

@Repository
public class SmallClassUserGradeDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<SmallClassUserGrade> selectSmallClassUserGrades(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<SmallClassUserGrade> result = null;

		try {
			result = sqlSession.selectList("smallClassUserGradeMapper.selectSmallClassUserGrades", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public SmallClassUserGrade selectSmallClassUserGrade(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<SmallClassUserGrade> result = null;

		try {
			result = sqlSession.selectList("smallClassUserGradeMapper.selectSmallClassUserGrades", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertSmallClassUserGrade(SmallClassUserGrade smallClassUserGrade, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("smallClassUserGradeMapper.insertSmallClassUserGrade", smallClassUserGrade);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertSmallClassUserGrades(List<SmallClassUserGrade> smallClassUserGrades, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("smallClassUserGradeMapper.insertSmallClassUserGrades", smallClassUserGrades);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSmallClassUserGrade(SmallClassUserGrade smallClassUserGrade, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("smallClassUserGradeMapper.updateSmallClassUserGrade", smallClassUserGrade);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateSmallClassUserGrade(Map<SmallClassUserGrade.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateSmallClassUserGrade(params, errorMessage);
	}

	public boolean updateSmallClassUserGrade(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("smallClassUserGradeMapper.updateSmallClassUserGradeByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSmallClassUserGrade(SmallClassUserGrade smallClassUserGrade, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("smallClassUserGradeMapper.deleteSmallClassUserGrade", smallClassUserGrade);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteSmallClassUserGrade(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("smallClassUserGradeMapper.deleteSmallClassUserGradeByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

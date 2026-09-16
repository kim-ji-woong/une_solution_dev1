package egovframework.base.dal.weather;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.weather.WeatherCurrent;
import egovframework.base.generic.Holder;

@Repository
public class WeatherCurrentDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<WeatherCurrent> selectWeatherCurrents(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<WeatherCurrent> result = null;

		try {
			result = sqlSession.selectList("weatherCurrentMapper.selectWeatherCurrents", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public WeatherCurrent selectWeatherCurrent(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<WeatherCurrent> result = null;

		try {
			result = sqlSession.selectList("weatherCurrentMapper.selectWeatherCurrents", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertWeatherCurrent(WeatherCurrent weatherCurrent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weatherCurrentMapper.insertWeatherCurrent", weatherCurrent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertWeatherCurrents(List<WeatherCurrent> weatherCurrents, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weatherCurrentMapper.insertWeatherCurrents", weatherCurrents);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeatherCurrent(WeatherCurrent weatherCurrent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weatherCurrentMapper.updateWeatherCurrent", weatherCurrent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeatherCurrent(Map<WeatherCurrent.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateWeatherCurrent(params, errorMessage);
	}

	public boolean updateWeatherCurrent(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weatherCurrentMapper.updateWeatherCurrentByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeatherCurrent(WeatherCurrent weatherCurrent, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("weatherCurrentMapper.deleteWeatherCurrent", weatherCurrent);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeatherCurrent(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("weatherCurrentMapper.deleteWeatherCurrentByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

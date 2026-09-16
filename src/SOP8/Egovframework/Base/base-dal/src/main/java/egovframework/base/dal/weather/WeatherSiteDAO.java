package egovframework.base.dal.weather;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.base.dal.DAOParent;
import egovframework.base.model.weather.WeatherSite;
import egovframework.base.generic.Holder;

@Repository
public class WeatherSiteDAO extends DAOParent {
	@Autowired
	private SqlSession sqlSession;

	public List<WeatherSite> selectWeatherSites(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {
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

		List<WeatherSite> result = null;

		try {
			result = sqlSession.selectList("weatherSiteMapper.selectWeatherSites", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result;
	}

	public WeatherSite selectWeatherSite(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {
		Map<String, Object> internalParams = new HashMap<>();
		String strCondition = makeCondition(params, additionalConditions);

		if (strCondition != null)
		{
			internalParams.put("customCondition", strCondition);
		}

		List<WeatherSite> result = null;

		try {
			result = sqlSession.selectList("weatherSiteMapper.selectWeatherSites", internalParams);
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
			return null;
		}

		errorMessage.value = null;
		return result.isEmpty() ? null : result.get(0);
	}

	public boolean insertWeatherSite(WeatherSite weatherSite, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weatherSiteMapper.insertWeatherSite", weatherSite);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean insertWeatherSites(List<WeatherSite> weatherSites, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.insert("weatherSiteMapper.insertWeatherSites", weatherSites);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeatherSite(WeatherSite weatherSite, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weatherSiteMapper.updateWeatherSite", weatherSite);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean updateWeatherSite(Map<WeatherSite.Fields, Object> updates, String condition, Holder<String> errorMessage) {
		String strSets = makeSet(updates);

		Map<String, Object> params = new HashMap<>();
		params.put("setStatement", strSets);

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		return updateWeatherSite(params, errorMessage);
	}

	public boolean updateWeatherSite(Map<String, Object> params, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.update("weatherSiteMapper.updateWeatherSiteByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeatherSite(WeatherSite weatherSite, Holder<String> errorMessage) {
		errorMessage.value = null;

		try {
			sqlSession.delete("weatherSiteMapper.deleteWeatherSite", weatherSite);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}

	public boolean deleteWeatherSite(String condition, Holder<String> errorMessage) {
		errorMessage.value = null;

		Map<String, Object> params = new HashMap<>();

		if (condition != null && !condition.trim().isEmpty()) {
			params.put("customCondition", condition);
		}

		try {
			sqlSession.delete("weatherSiteMapper.deleteWeatherSiteByCondition", params);
			return true;
		}
		catch (Exception e) {
			errorMessage.value = e.getMessage();
		}

		return false;
	}
}

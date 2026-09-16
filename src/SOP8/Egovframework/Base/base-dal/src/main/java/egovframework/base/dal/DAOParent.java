package egovframework.base.dal;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import egovframework.base.dal.IDatabase;

public class DAOParent {

    @Autowired
    protected SqlSession sqlSession;

    /** selectList
     * 공통 조회 메서드
     * @param <T> 반환할 모델 타입
     * @param mapperNamespace MyBatis 매퍼 네임스페이스
     * @param queryId 쿼리 ID (예: "selectUsers", "selectSensors")
     * @param params 검색 조건 파라미터
     * @param additionalConditions 추가 조건
     * @param orderBy 정렬 조건
     * @return 조회 결과 List
     */
    protected <T> List<T> selectList(String mapperNamespace,
                                     String queryId,
                                     Map<String, Object> params,
                                     String additionalConditions,
                                     String orderBy)
    {
        Map<String, Object> internalParams = new HashMap<>();
        String strCondition = makeCondition(params, additionalConditions);

        if (strCondition != null) {
            internalParams.put("customCondition", strCondition);
        }

        if (orderBy != null && !orderBy.trim().isEmpty()) {
            internalParams.put("orderBy", orderBy);
        }

        List<T> result = null;

        try {
            String fullQueryId = mapperNamespace + "." + queryId;
            result = sqlSession.selectList(fullQueryId, internalParams);
        } catch (Exception e) {
            return null;
        }
        return result;
    }

    /**
    * 단일 객체 조회 메서드
    * @param <T> 반환할 모델 타입
    * @param mapperNamespace MyBatis 매퍼 네임스페이스
    * @param queryId 쿼리 ID (예: "selectUsers", "selectSensors")
    * @param params 검색 조건 파라미터
    * @param additionalConditions 추가 조건
    * @param orderBy 정렬 조건
    * @return T 단일 리터럴
    */
    protected <T> T selectOne(String mapperNamespace,
                              String queryId,
                              Map<String, Object> params,
                              String additionalConditions,
                              String orderBy)
    {
        Map<String, Object> internalParams = new HashMap<>();
        String strCondition = makeCondition(params, additionalConditions);

        if (strCondition != null) {
            internalParams.put("customCondition", strCondition);
        }

        T result = null;

        try {
            String fullQueryId = mapperNamespace + "." + queryId;
            result = sqlSession.selectOne(fullQueryId, internalParams);
        } catch (Exception e) {
            return null;
        }
        return result;
    }

    protected String makeCondition(Map<String, Object> params, String additionalConditions)
    {
        StringBuilder strCondition = new StringBuilder();

        if (params != null)
        {
            params.forEach((key, value) ->
            {
                if (key != null) {
                    String strKey = key.trim();

                    if (!strKey.isEmpty()) {
                        String strValue = getValueString(value);
                        String str = strValue.equals("null") ? strKey + " is " + strValue : strKey + " = " + strValue;

                        if (strCondition.isEmpty()) {
                            strCondition.append(str);
                        } else {
                            strCondition.append(" and ").append(str);
                        }
                    }
                }
            });
        }

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            if (strCondition.isEmpty())
            {
                strCondition.append(additionalConditions);
            }
            else
            {
                if (additionalConditions.startsWith("order by")) {
                    strCondition.append(" ").append(additionalConditions);
                }
                else {
                    strCondition.append(" and ").append(additionalConditions);
                }
            }
        }

        return strCondition.toString();
    }

    protected <T> String makeSet(Map<T, Object> params)
    {
        StringBuilder strSets = new StringBuilder();

        if (params != null)
        {
            params.forEach((key, value) ->
            {
                String strKey = String.format("%s", key);
                String strValue = getValueString(value);
                String str = strKey + " = " + strValue;

                if (strSets.isEmpty())
                {
                    strSets.append(str);
                }
                else
                {
                    strSets.append(", ").append(str);
                }
            });
        }

        return strSets.toString();
    }

    protected static String getValueString(Object value)
    {
        if (value == null)
        {
            return "null";
        }

        if (value instanceof String)
        {
            return "'" + (String)value + "'";
        }
        else if (value instanceof LocalDateTime)
        {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return "'" + ((LocalDateTime)value).format(formatter) + "'";
        }

        return String.valueOf(value);
    }

    protected String CheckPagination(Integer beginIndex, Integer itemCount, Map<String, Object> internalParams, IDatabase database)
    {
        return CheckPagination(beginIndex, itemCount, internalParams, database, null);
    }

    protected String CheckPagination(Integer beginIndex, Integer itemCount, Map<String, Object> internalParams, IDatabase database, String orderByField)
    {
        String tail = "";

        if (orderByField != null && !orderByField.isEmpty())
            internalParams.put("orderByField", orderByField);

        if (beginIndex != null)
        {
            String dbType = database.getDbType();

            if (dbType != null)
            {
                if (dbType.equals("mysql"))
                {
                    tail = "MySql";

                    internalParams.put("beginIndex", beginIndex - 1);

                    if (itemCount != null)
                        internalParams.put("endIndex", itemCount);
                    else
                        internalParams.put("endIndex", beginIndex + 1000000);
                }
                else if (dbType.equals("sql-server"))
                {
                    tail = "SqlServer";

                    internalParams.put("beginIndex", beginIndex - 1);

                    if (itemCount != null)
                        internalParams.put("endIndex", itemCount);
                }
                else if (dbType.equals("oracle"))
                {
                    tail = "Oracle";

                    internalParams.put("beginIndex", beginIndex);

                    if (itemCount != null)
                        internalParams.put("endIndex", beginIndex + itemCount - 1);
                }
                else if (dbType.equals("postgresql"))
                {
                    tail = "PostgreSql";

                    internalParams.put("beginIndex", beginIndex - 1);

                    if (itemCount != null)
                        internalParams.put("endIndex", itemCount);
                    else
                        internalParams.put("endIndex", beginIndex + 1000000);
                }
            }
        }

        return tail;
    }
}

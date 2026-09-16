package egovframework.base.dal.join;

import egovframework.base.dal.DAOParent;
import egovframework.base.dal.IDatabase;
import egovframework.base.generic.Holder;
import egovframework.base.model.account.User;
import egovframework.base.model.history.ActionStep;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class JoinDAO extends DAOParent {
    @Autowired
    private SqlSession sqlSession;

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorSensorZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorSensorZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorSensorZoneSdmsCCTV(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorSensorZoneSdmsCCTV" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneEquipZoneCCTVSensorZoneCCTVEquipmentZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneEquipZoneCCTVSensorZoneCCTVEquipmentZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneSensorEquipZoneCCTVSensorZoneCCTVEquipmentZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneSensorEquipZoneCCTVSensorZoneCCTVEquipmentZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneHistorySensorZoneHistoryDetail(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneHistorySensorZoneHistoryDetail" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneHistorySensorZoneHistoryDetailSensorZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneHistorySensorZoneHistoryDetailSensorZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneHistorySensorZoneHistoryDetailSensorZoneEquipmentZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneHistorySensorZoneHistoryDetailSensorZoneEquipmentZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinCurrentAlarmSensorZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinCurrentAlarmSensorZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorCCTV(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorCCTV" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneMaterialSensor(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneMaterialSensor" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinVersionUser(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinVersionUser" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSectionGridGridColumn(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSectionGridGridColumn" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSectionGridGridRow(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSectionGridGridRow" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSectionComponentSectionAnnotationDecisionEndPointProcessTransmission(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSectionComponentSectionAnnotationDecisionEndPointProcessTransmission" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinDisasterVersionUser(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinDisasterVersionUser" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSessionUserGrade(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSessionUserGrade" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinDisasterCategorySubDisasterCategoryDisasterVersionUser(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinDisasterCategorySubDisasterCategoryDisasterVersionUser" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinTemporaryMemberTemporaryRegularRegularMember(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinTemporaryMemberTemporaryRegularRegularMember" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinRegularRegularMember(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinRegularRegularMember" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinActionStepHistoryVersion(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinActionStepHistoryVersion" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinActionStepHistoryActionStepVersionLargeClassMiddleClassSmallClass(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinActionStepHistoryActionStepVersionLargeClassMiddleClassSmallClass" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinProcessTemporaryTemporary(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinProcessTemporaryTemporary" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinTransmissionTemporaryTemporary(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinTransmissionTemporaryTemporary" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinActionStepActionStepHistory(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinActionStepActionStepHistory" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinActionStepHistoryActionStepSmallClass(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinActionStepHistoryActionStepSmallClass" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinComponentHistoryComponent(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinComponentHistoryComponent" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinActionStepDisasterCategory(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinActionStepDisasterCategory" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinDisasterCategorySubDisasterCategoryDisasterActionStepActionStepHistoryUser(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String orderByField = String.format("e.%s", ActionStep.Fields.begin_time);
        String tail = CheckPagination(beginIndex, itemCount, internalParams, database, orderByField);
        return sqlSession.selectList("joinMapper.joinDisasterCategorySubDisasterCategoryDisasterActionStepActionStepHistoryUser" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinUserRegularMemberRegular(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String orderByField = String.format("a.%s", User.Fields.user_sn);
        String tail = CheckPagination(beginIndex, itemCount, internalParams, database, orderByField);
        return sqlSession.selectList("joinMapper.joinUserRegularMemberRegular" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinUserRegularMember(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String orderByField = String.format("a.%s", User.Fields.user_sn);
        String tail = CheckPagination(beginIndex, itemCount, internalParams, database, orderByField);
        return sqlSession.selectList("joinMapper.joinUserRegularMember" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinEquipmentZoneEquipmentZoneLinkedZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinEquipmentZoneEquipmentZoneLinkedZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinHistorySensorReactionHistorySensorZoneZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinHistorySensorReactionHistorySensorZoneZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinHistorySensorZoneDetailSensorZoneEquipmentZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinHistorySensorZoneDetailSensorZoneEquipmentZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneEquipmentZoneZoneBuilding(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneEquipmentZoneZoneBuilding" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinSensorZoneEquipmentZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinSensorZoneEquipmentZone" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinCurrentAlarmHistorySensorZoneDetail(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinCurrentAlarmHistorySensorZoneDetail" + tail, internalParams);
    }

    // beginIndex : 첫번째 Item은 1부터 시작
    // itemCount : 한 페이지에 표시될 Item의 최대 개수
    public List<Map<String, Object>> joinCurrentAlarmHistorySensorZone(String additionalConditions, String orderBy, Integer beginIndex, Integer itemCount, IDatabase database, Holder<String> errorMessage) {
        Map<String, Object> internalParams = new HashMap<>();

        if (additionalConditions != null && !additionalConditions.trim().isEmpty())
        {
            internalParams.put("customCondition", additionalConditions);
        }

        if (orderBy != null && !orderBy.trim().isEmpty())
        {
            internalParams.put("orderBy", orderBy);
        }

        String tail = CheckPagination(beginIndex, itemCount, internalParams, database);
        return sqlSession.selectList("joinMapper.joinCurrentAlarmHistorySensorZone" + tail, internalParams);
    }
}
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Gwangyang.IBLL.Request;
using Gwangyang.IBLL.Response;
using Gwangyang.Model;

namespace Gwangyang.BLL.Process
{
    public class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExternalSensorTypes GetExternalSensorTypes(RequestExternalSensorTypes data)
        {
            string strErrorMessage;
            string strCondition = null;

            IEnumerable<SensorType> sensorTypes =
                m_dataManager.GetSelect().Select<SensorType>(strCondition, out strErrorMessage);

            if (sensorTypes == null)
            {
                return new ResponseExternalSensorTypes(false, strErrorMessage);
            }

            ResponseExternalSensorTypes response = new ResponseExternalSensorTypes();

            try
            {
                foreach (var item in sensorTypes)
                {
                    SensorType sensorType = new SensorType();
                    sensorType.sensor_type_idx = item.sensor_type_idx;
                    sensorType.sensor_type_name = item.sensor_type_name;
                    sensorType.co_code = item.co_code;
                    sensorType.sensor_category_idx = item.sensor_category_idx;
                    sensorType.alarm_yn = item.alarm_yn;
                    response.SensorTypes.Add(sensorType);
                }
            }
            catch (System.Exception ex)
            {
                return new ResponseExternalSensorTypes(false, ex.Message);
            }

            response.Success = true;
            response.Message = "RequestExternalSensorTypes is success.";
            return response;
        }

        public ResponseExternalSensorCategories GetExternalSensorCategories(RequestExternalSensorCategories data)
        {
            string strErrorMessage;
            string strCondition = null;

            IEnumerable<SensorCategory> sensorCategories =
                m_dataManager.GetSelect().Select<SensorCategory>(strCondition, out strErrorMessage);

            if (sensorCategories == null)
            {
                return new ResponseExternalSensorCategories(false, strErrorMessage);
            }

            ResponseExternalSensorCategories response = new ResponseExternalSensorCategories();

            try
            {
                foreach (var item in sensorCategories)
                {
                    SensorCategory sensorCategory = new SensorCategory();
                    sensorCategory.sensor_category_idx = item.sensor_category_idx;
                    sensorCategory.sensor_category_name = item.sensor_category_name;
                    response.SensorCategories.Add(sensorCategory);
                }
            }
            catch (System.Exception ex)
            {
                return new ResponseExternalSensorCategories(false, ex.Message);
            }

            response.Success = true;
            response.Message = "RequestExternalSensorCategories is success.";
            return response;
        }

        public ResponseExternalSensorLink GetExternalSensorLink()
        {
            string strErrorMessage;
            string strCondition = null;

            ResponseExternalSensorLink response = new ResponseExternalSensorLink();

            try
            {
                IEnumerable<SensorLink> sensorLinks =
                    m_dataManager.GetSelect().Select<SensorLink>(strCondition, out strErrorMessage);

                if (sensorLinks == null)
                {
                    return new ResponseExternalSensorLink(false, strErrorMessage);
                }

                foreach (SensorLink sensorLink in sensorLinks)
                {
                    SensorLink sl = new SensorLink();
                    sl.node_id = sensorLink.node_id;
                    sl.sensor_name = sensorLink.sensor_name;
                    sl.sensor_type_idx = sensorLink.sensor_type_idx;
                    sl.zone_sn = sensorLink.zone_sn;
                    sl.location = sensorLink.location;
                    sl.lat = sensorLink.lat;
                    sl.lon = sensorLink.lon;
                    response.SensorLinks.Add(sl);
                }

            }
            catch (Exception e)
            {
                return new ResponseExternalSensorLink(false, e.Message);
            }

            response.Success = true;
            response.Message = "RequestExternalSensorTypes is success.";
            return response;
        }

        public ResponseExternalPOIInfo GetExternalPOIInfo()
        {
            ResponseExternalPOIInfo response = new ResponseExternalPOIInfo();

            string strErrorMessage;
            string strCondition = null;

            try
            {
                IEnumerable<POIInfo> poiInfos =
                    m_dataManager.GetSelect().Select<POIInfo>(strCondition, out strErrorMessage);

                if (poiInfos == null)
                {
                    return new ResponseExternalPOIInfo(false, strErrorMessage);
                }

                foreach (POIInfo poiInfo in poiInfos)
                {
                    POIInfo pi = new POIInfo();
                    pi.node_id = poiInfo.node_id;
                    pi.sensor_type_idx = poiInfo.sensor_type_idx;
                    pi.x = poiInfo.x;
                    pi.y = poiInfo.y;
                    pi.z = poiInfo.z;
                    pi.zone_no = poiInfo.zone_no;
                    response.POIInfos.Add(pi);
                }
            }
            catch (Exception e)
            {
                return new ResponseExternalPOIInfo(false, e.Message);
            }

            return response;
        }

        public ResponseExternalSensorTypeSubTypes GetExternalSensorTypeSubTypes()
        {
            string strErrorMessage;
            string strCondition = null;

            ResponseExternalSensorTypeSubTypes response = new ResponseExternalSensorTypeSubTypes();

            try
            {
                IEnumerable<SensorTypeSubTypes> sensorTypeSubTypes = m_dataManager.GetSelect()
                    .Select<SensorTypeSubTypes>(strCondition, out strErrorMessage);

                if (sensorTypeSubTypes == null)
                {
                    return new ResponseExternalSensorTypeSubTypes(false, strErrorMessage);
                }

                foreach (SensorTypeSubTypes sensorTypeSubType in sensorTypeSubTypes)
                {
                    SensorTypeSubTypes stst = new SensorTypeSubTypes();
                    stst.sensor_type_idx = sensorTypeSubType.sensor_type_idx;
                    stst.sensor_sub_types = sensorTypeSubType.sensor_sub_types;
                    
                    response.SensorTypeSubTypes.Add(
                        stst.sensor_type_idx,
                        stst.sensor_sub_types
                            .Split(',')
                            .Select(s => s == "null" ? (int?)null : int.Parse(s))
                            .ToList()
                    );
                }
            }
            catch (Exception e)
            {
                return new ResponseExternalSensorTypeSubTypes(false, e.Message);
            }
            
            response.Success = true;    
            return response;
        }
        
        public ResponseExternalSensorHistories GetExternalSensorHistories(RequestExternalSensorHistories data)
        {
            string strErrorMessage;
            string strCondition = null;

            ResponseExternalSensorHistories response = new ResponseExternalSensorHistories();

            try
            {
                strCondition = data.NodeID > 0 
                    ? $"{Sensor.Fields.zone_sn} = {data.NodeID}"
                    : "1=1";
            
                IEnumerable<Sensor> sensors = m_dataManager.GetSelect().Select<Sensor>(strCondition, out strErrorMessage).ToList();
                var sensorList = sensors.ToList();

                if (!sensorList.Any())
                {
                    return new ResponseExternalSensorHistories(false, "No sensors found.");
                }
                
                string sensorSNs = string.Join(",", sensors.Select(s => $"{s.sensor_sn}"));
                
                DateTime minDataTime = DateTime.Now.AddHours(-1);

                string strQuery = 
                    $@"Select 
                        t.{SensorHistory.Fields.sensor_his_no},
                        t.{SensorHistory.Fields.sensor_sn},
                        t.{SensorHistory.Fields.sensor_value},
                        t.{SensorHistory.Fields.his_timestamp},
                        t.{SensorHistory.Fields.temp_idx} 
                        from (
                            Select  eh.{SensorHistory.Fields.sensor_his_no}, 
                                    eh.{SensorHistory.Fields.sensor_sn},
                                    eh.{SensorHistory.Fields.sensor_value},
                                    eh.{SensorHistory.Fields.his_timestamp},
                                    eh.{SensorHistory.Fields.temp_idx},
                                    ROW_NUMBER() OVER (PARTITION BY eh.{SensorHistory.Fields.sensor_sn} ORDER BY eh.{SensorHistory.Fields.his_timestamp} DESC) as rn
                            from {SensorHistory.TableName} eh
                            where eh.{SensorHistory.Fields.sensor_sn} in ({sensorSNs})
                        ) t
                        where t.rn <= CASE
                            WHEN EXISTS 
                                (
                                SELECT 1
                                FROM {SensorZone.TableName} fsz
                                    JOIN {SubType.TableName} st ON fsz.{SensorZone.Fields.sensor_sub_ty_no} = st.{SubType.Fields.sensor_sub_ty_no}
                                WHERE fsz.{SensorZone.Fields.sensor_sn} = t.{SensorHistory.Fields.sensor_sn}  -- 외부 쿼리의 sensor_sn과 연결
                                    AND st.{SubType.Fields.descp} LIKE '%28672%'
                                ) THEN 5  -- 조건 만족 시 최근 7개
                                    ELSE 7 -- 조건 불만족 시 모든 rn (사실상 제한 없음)
                            END
                        --and {SensorHistory.Fields.his_timestamp} >= '{minDataTime:yyyy-MM-dd HH:mm:ss}'
                        order by t.{SensorHistory.Fields.sensor_sn} asc, 
                                 t.{SensorHistory.Fields.his_timestamp} desc";
                
                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                
                if (results == null)
                {
                    return new ResponseExternalSensorHistories(false, strErrorMessage);
                }
                
                foreach (var item in results)
                {
                    SensorHistory sensorHistory = new SensorHistory();
                    sensorHistory.sensor_his_no = item.sensor_his_no;
                    sensorHistory.sensor_sn = item.sensor_sn;
                    sensorHistory.sensor_value = item.sensor_value;
                    sensorHistory.his_timestamp = item.his_timestamp;
                    sensorHistory.temp_idx = item.temp_idx;

                    response.SensorHistories.Add(sensorHistory);
                }
                
                if (response.SensorHistories.Count == 0)
                {
                    return new ResponseExternalSensorHistories(true, "No sensor history data found.");
                }

            }
            catch (Exception e)
            {
                return new ResponseExternalSensorHistories(false, e.Message);
            }

            response.Success = true;
            return response;
        }

        public ResponseSensorSubTypes GetSensorSubTypes()
        {
            ResponseSensorSubTypes response = new ResponseSensorSubTypes();

            IEnumerable<SubType> subTypes = m_dataManager.GetSelect().Select<SubType>(null, out string strErrorMessage);
            
            if (subTypes == null)
                return new ResponseSensorSubTypes(false, strErrorMessage);
            
            foreach (SubType subType in subTypes)
                response.SubTypes.Add(subType);
            
            response.Success = true;
            
            return response;
        }

        public ResponseExternalMaterialLinks GetExternalMaterialLinks()
        {
            IEnumerable<MaterialLink> materialLinks = m_dataManager.GetSelect().Select<MaterialLink>(null, out string strErrorMessage);
            
            if (materialLinks == null)
                return new ResponseExternalMaterialLinks(false, strErrorMessage);
            
            ResponseExternalMaterialLinks response = new ResponseExternalMaterialLinks();
            
            response.MaterialLinks = materialLinks.ToList();
            
            return response;
        }

        public ResponseWeatherData GetExternalWeatherData()
        {
            IEnumerable<WeatherData> weatherDatas = m_dataManager.GetSelect().Select<WeatherData>(null, out string strErrorMessage);
            
            if (weatherDatas == null)
                return new ResponseWeatherData(false, strErrorMessage);
            
            ResponseWeatherData response = new ResponseWeatherData(true, "");
            response.WeatherData = weatherDatas.ToList();
            
            return response;
        }
    }
}
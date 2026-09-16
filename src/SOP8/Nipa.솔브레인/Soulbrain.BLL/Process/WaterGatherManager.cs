using System;
using System.Collections.Generic;
using System.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using Soulbrain.BLL.Request;
using Soulbrain.BLL.Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Process
{
    public class WaterGatherManager
    {
        private IDataManager m_dataManager = null;
        
        public WaterGatherManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWaterGatherInfo RequestWaterGatherInfo(RequestWaterGatherInfo data)
        {
            if (data.SensorSn <= 0)
                return new ResponseWaterGatherInfo(false, $@"올바르지 않은 센서 고유번호입니다.");

            try
            {
                ResponseWaterGatherInfo response = new ResponseWaterGatherInfo(true, "");
                response.WaterGather = GetWaterGather(data.SensorSn, out int nWaterGatherSn);
                return response;
            }
            catch (Exception exception)
            {
                return new ResponseWaterGatherInfo(false, exception.Message);
            }
        }

        private WaterGather GetWaterGather(int sensorSn, out int nWaterGatherSn)
        {
            string strCondition = $@"{WaterGather.Fields.sensor_sn} = {sensorSn}";

            WaterGather waterGather = m_dataManager.GetSelect().SelectFirst<WaterGather>(strCondition, out string strErrorMessage);
            
            if (waterGather == null)
                throw new Exception($@"요청한 SensorSn에 해당하는 WaterGather 정보가 없습니다. : {strErrorMessage}");
            
            nWaterGatherSn = waterGather.wgr_sn;
            
            return waterGather;
        }

    }
}
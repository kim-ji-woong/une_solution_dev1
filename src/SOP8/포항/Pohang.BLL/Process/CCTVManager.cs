using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Pohang.IBLL.Request;
using Pohang.IBLL.Response;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using System.Collections;
using Base.DAL;
using Pohang.IBLL.Models;

namespace Pohang.BLL.Process
{
    class CCTVManager
    {
        private IDataManager m_dataManager = null;

        public CCTVManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCCTVInfo GetCCTVInfo(RequestCCTVInfo request)
        {
            if (request.CctvNos == null || request.CctvNos.Count == 0)
                return new ResponseCCTVInfo(true, "");

            string strErrorMessage;
            string strCondition = string.Format("b.{0} in ({1})", CCTV.Fields.cctv_no, string.Join(',', request.CctvNos.ToArray()));

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinSensorCCTV(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseCCTVInfo(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            ResponseCCTVInfo response = new ResponseCCTVInfo(true, "");

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Sensor && arrDatas[i + 1] is CCTV)
                {
                    Sensor sensor = (Sensor)arrDatas[i];
                    CCTV cctv = (CCTV)arrDatas[i + 1];

                    CctvEx cctvEx = new CctvEx(cctv);
                    cctvEx.CameraName = sensor.sensor_name;
                    response.Cctvs.Add(cctvEx);
                }
            }

            return response;
        }
    }
}

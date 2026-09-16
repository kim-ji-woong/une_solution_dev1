using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccessIntrusion
{
    public class IntrusionDataManager
    {
        private AccessIntrusionManager m_parent = null;
        private DataManager m_dataManager = null;

        //private Dictionary<int, int> DicSensorKey = new Dictionary<int, int>();

        public IntrusionDataManager(AccessIntrusionManager parent, string strServerIP, string strName, string strID, string strPW)
        {
            m_parent = parent;
            m_dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, strServerIP, strName, strID, strPW);

            // DeviceID 값과 SensorSn 매칭 변수
            //DicSensorKey[4519] = 200001;
            //DicSensorKey[4520] = 200002;
            //DicSensorKey[4521] = 200003;
            //DicSensorKey[4522] = 200004;
            //DicSensorKey[4510] = 200005;
            //DicSensorKey[4511] = 200006;
            //DicSensorKey[4512] = 200007;
            //DicSensorKey[4513] = 200008;
            //DicSensorKey[4501] = 200009;
            //DicSensorKey[4502] = 200010;
            //DicSensorKey[4503] = 200011;
            //DicSensorKey[4504] = 200012;
            //DicSensorKey[4528] = 200013;
            //DicSensorKey[4474] = 200014;
            //DicSensorKey[4475] = 200015;
            //DicSensorKey[4476] = 200016;
            //DicSensorKey[4477] = 200017;
            //DicSensorKey[4478] = 200018;
            //DicSensorKey[4479] = 200019;
            //DicSensorKey[4480] = 200020;
            //DicSensorKey[4481] = 200021;
            //DicSensorKey[4483] = 200022;
            //DicSensorKey[4484] = 200023;
            //DicSensorKey[4485] = 200024;
            //DicSensorKey[4486] = 200025;
            //DicSensorKey[4487] = 200026;
            //DicSensorKey[4550] = 200027;
            //DicSensorKey[4551] = 200028;
            //DicSensorKey[4552] = 200029;
            //DicSensorKey[4553] = 200030;
            //DicSensorKey[4554] = 200031;
            //DicSensorKey[4555] = 200032;
            //DicSensorKey[4492] = 200033;
            //DicSensorKey[4493] = 200034;
            //DicSensorKey[4494] = 200035;
            //DicSensorKey[4538] = 200036;
            //DicSensorKey[4539] = 200037;
            //DicSensorKey[4540] = 200038;
        }

        //public int? GetDeviceID(int nSensorSn)
        //{
        //    int? nResult = null;

        //    foreach (KeyValuePair<int, int> pair in DicSensorKey)
        //    {
        //        if (pair.Value == nSensorSn)
        //        {
        //            nResult = pair.Key;
        //            break;
        //        }
        //    }

        //    return nResult;
        //}

        public Dictionary<int, SensorStatus> GetAlarmIntrusions(Dictionary<int, int> dicSensorKey, out string strErrMsg)
        {
            Dictionary<int, SensorStatus> dicAlarms = new Dictionary<int, SensorStatus>();
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT DeviceID, EqStatus, DeviceTypeID FROM View_Security_Status_ex WHERE DeviceTypeID = 10 AND LocationName LIKE '%명동%' AND EqStatus = 'A-1001'");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    if (dicSensorKey.ContainsKey(result.DeviceID) == false)
                        continue;

                    SensorStatus status = new SensorStatus();
                    status.DeviceID = result.DeviceID;
                    status.SensorSn = dicSensorKey[status.DeviceID];
                    status.EqStatus = result.EqStatus;

                    dicAlarms[status.DeviceID] = status;
                }
            }
            catch (Exception e)
            {
                dicAlarms = null;
                strErrMsg = e.Message;
            }

            return dicAlarms;
        }
    }

    public class SensorStatus
    {
        /// <summary>
        /// 침입센서 ID
        /// </summary>
        public int DeviceID { get; set; }
        /// <summary>
        /// 센서 일련번호
        /// </summary>
        public int SensorSn { get; set; }
        /// <summary>
        /// 침입센서 상태
        /// </summary>
        public string EqStatus { get; set; }
    }
}

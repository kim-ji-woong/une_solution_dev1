using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSParking
{
    public class JSDBManager
    {
        private JSParkingManager m_parent = null;
        private DataManager m_dataManager = null;

        public JSDBManager(JSParkingManager parent, DataManager dataManager)
        {
            m_parent = parent;
            m_dataManager = dataManager;
        }

        public List<ParkingData> ReadParkingData(DateTime dtLast, out string strErrMsg)
        {
            strErrMsg = null;
            List<ParkingData> parkings = null;

            try
            {
                string strSQL = string.Format(@$"SELECT ParkMngDtm, OutMngDtm, CarParkTp, CarNoAll, LprInBlob, LprOutBlob FROM VW_MAST
                                            WHERE (ParkMngDtm > '{dtLast.ToString("yyyyMMdd_HHmmss")}')
                                            OR (OutMngDtm <> '' AND OutMngDtm > '{dtLast.ToString("yyyyMMdd_HHmmss")}')");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException($"VW_MAST Select Error: {strErrMsg}");
                }

                parkings = new List<ParkingData>();

                foreach (var result in results)
                {
                    // 차량번호가 없을 경우 제외
                    if (result.CarNoAll == null || result.CarNoAll == "")
                        continue;

                    // 입차 데이터
                    bool isValid = DateTime.TryParseExact(
                        result.ParkMngDtm,
                        "yyyyMMdd_HHmmss",
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None,
                        out DateTime parkDtm
                    );

                    if (isValid && parkDtm > dtLast)
                    {
                        ParkingData data = new ParkingData();
                        data.IsEntry = true;
                        data.MngDtm = parkDtm;
                        data.CarParkTp = result.CarParkTp;
                        data.CarNoAll = result.CarNoAll;
                        data.LprBlob = result.LprInBlob;

                        string strKey = data.CarNoAll + "_" + data.MngDtm;
                        parkings.Add(data);
                    }

                    // 출차 데이터
                    isValid = DateTime.TryParseExact(
                        result.OutMngDtm,
                        "yyyyMMdd_HHmmss",
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None,
                        out parkDtm
                    );

                    if (isValid && parkDtm > dtLast)
                    {
                        ParkingData data = new ParkingData();
                        data.IsEntry = false;
                        data.MngDtm = parkDtm;
                        data.CarParkTp = result.CarParkTp;
                        data.CarNoAll = result.CarNoAll;
                        data.LprBlob = result.LprOutBlob;

                        string strKey = data.CarNoAll + "_" + data.MngDtm;
                        parkings.Add(data);
                    }
                }
            }
            catch (Exception e)
            {
                parkings = null;
                strErrMsg = e.Message;
            }

            return parkings;
        }
    }

    public class ParkingData
    {
        /// <summary>
        /// 입차 여부
        /// </summary>
        public bool IsEntry { get; set; }
        /// <summary>
        /// 입차/출차 시간
        /// </summary>
        public DateTime MngDtm { get; set; }
        /// <summary>
        /// 1: 시간권, 2: 정기권
        /// </summary>
        public string CarParkTp { get; set; }
        /// <summary>
        /// 차량번호
        /// </summary>
        public string CarNoAll { get; set; }
        /// <summary>
        /// 입차/출차 이미지
        /// </summary>
        public byte[] LprBlob { get; set; }
    }
}

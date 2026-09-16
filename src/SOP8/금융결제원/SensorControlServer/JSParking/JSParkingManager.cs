using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSensorServer;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace JSParking
{
    public class JSParkingManager : SensorServer
    {
        private static JSParkingManager m_processManager = null;
        private static JSDBManager m_JSDBManager = null;
        private static DBDataManager m_dbDataManager = null;

        private bool m_closeApp = false;

        private JSParkingManager(string strServerIP, string strName, string strID, string strPW, string strServerPath)
           : base("Parking\\JSParking")
        {
            DataManager dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, strServerIP, strName, strID, strPW);

            m_JSDBManager = new JSDBManager(this, dataManager);
            m_dbDataManager = new DBDataManager(this, this.DataManager, strServerPath);
        }


        public static void Run()
        {
            if (m_processManager == null)
            {
                m_processManager = MakeInstance();

                if (m_processManager == null)
                    return;
            }
            else
                return;

            m_processManager.Logger.Write("LampusTechManager Run()");

            Thread t = new Thread(() => m_processManager.WatchParkingThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static JSParkingManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // JSParking DB 정보 필요
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");
            // 주차 이미지 파일 저장 경로 (웹앱 정적 리소스 폴더)
            string strServerPath = ConfigurationManager.AppSettings.Get("ServerPath");

            return new JSParkingManager(strServerIP, strName, strID, strPW, strServerPath);
        }

        private void WatchParkingThread()
        {
            m_closeApp = false;

            while (m_closeApp == false)
            {
                try
                {
                    // 마지막 입차/출차 시간 조회
                    if (m_dbDataManager.ReadLastParking(out DateTime dtLast, out string strErrMsg) == false)
                        throw new ApplicationException($"ReadLastParking Error ({strErrMsg})");

                    // JSParking DB 읽기
                    List<ParkingData> parkings = m_JSDBManager.ReadParkingData(dtLast, out strErrMsg);
                    if (parkings == null)
                        throw new ApplicationException($"ReadParkingData Error ({strErrMsg})");

                    // 신규 주차 데이터 추가
                    if (m_dbDataManager.UpdateParkingData(parkings, out strErrMsg) == false)
                        throw new ApplicationException($"UpdateParkingData Error ({strErrMsg})");
                }
                catch (Exception e)
                {
                    this.Logger.Write("WatchParkingThread() Exception : " + e.Message);
                    Thread.Sleep(60000);
                }

                Thread.Sleep(500);
            }
        }
    }
}

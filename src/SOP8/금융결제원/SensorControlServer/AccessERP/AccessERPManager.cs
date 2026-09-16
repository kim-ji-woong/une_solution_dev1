using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsSensorServer;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AccessERP
{
    class AccessERPManager : SensorServer
    {
        private static AccessERPManager m_processManager = null;
        private AccessManager m_accessManager = null;
        private DBManager m_dbManager = null;
        private ImageManager m_imgManager = null;

        private bool m_closeApp = false;

        private string m_strServerIP = null;
        private string m_strName = null;
        private string m_strID = null;
        private string m_strPW = null;

        private DateTime m_dtLast = new DateTime();

        private AccessERPManager(string strServerIP, string strName, string strID, string strPW, string strAccessPath, string strServerPath)
           : base("ERP\\AccessERP")
        {
            m_strServerIP = strServerIP;
            m_strName = strName;
            m_strID = strID;
            m_strPW = strPW;

            DataManager dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, m_strServerIP, m_strName, m_strID, m_strPW);

            m_accessManager = new AccessManager(this, dataManager);
            m_dbManager = new DBManager(this, this.DataManager);
            m_imgManager = new ImageManager(this, strAccessPath, strServerPath);
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

            m_processManager.Logger.Write("AccessERPManager Run()");

            Thread t = new Thread(() => m_processManager.SynchronizationThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static AccessERPManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // IP, Port 정보 필요
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");

            string strAccessPath = ConfigurationManager.AppSettings.Get("AccessPath");
            string strServerPath = ConfigurationManager.AppSettings.Get("ServerPath");

            return new AccessERPManager(strServerIP, strName, strID, strPW, strAccessPath, strServerPath);
        }

        private void SynchronizationThread()
        {
            m_closeApp = false;
            string strErrMsg = null;

            while (m_closeApp == false)
            {
                try
                {
                    // 하루에 한번 체크
                    DateTime dtToday = DateTime.Today;

                    if (dtToday.Date != m_dtLast.Date)
                    {
                        // 이미지 다운로드
                        if (m_imgManager.Synchronization(out strErrMsg) == false)
                        {
                            this.Logger.Write("ImageManager Synchronization Error : " + strErrMsg);
                        }

                        // VIEW_ORG 조직 정보 조회
                        List<ORG> orgs = m_accessManager.GetOrgDatas(out strErrMsg);
                        if (orgs == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        // VIEW_CARD_PERSON 조직원 정보 조회
                        List<Person> people = m_accessManager.GetPersonDatas(out List<string> levels, out strErrMsg);
                        if (people == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        // co_team_optn 조회 (직급)
                        Dictionary<string, int> dicLevels = m_dbManager.GetLevels(this.DataManager, out strErrMsg);
                        if (dicLevels == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        // co_team_rgl 조회
                        List<Regular> regulars = m_dbManager.GetRegulars(out strErrMsg);
                        if (regulars == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        // co_team_rgl_memb 조회
                        List<RegularMember> regularMembers = m_dbManager.GetRegularMembers(out strErrMsg);
                        if (regularMembers == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }



                        // 동기화 작업 시작
                        IDataManager dataManager = this.DataManager.Clone();
                        if (dataManager.BeginBatch(out strErrMsg) == false)
                        {
                            throw new ApplicationException("BeginBatch Error" + strErrMsg);
                        }

                        try
                        {
                            // 직급 동기화
                            Dictionary<string, int> dicJobLevels = m_dbManager.CompareJobLevel(dataManager, dicLevels, levels, out strErrMsg);
                            if (dicJobLevels == null)
                            {
                                throw new ApplicationException(strErrMsg);
                            }

                            if (m_dbManager.Synchronization(dataManager, orgs, people, dicJobLevels, regulars, regularMembers, out strErrMsg) == false)
                            {
                                throw new ApplicationException(strErrMsg);
                            }

                            if (dataManager.BatchCommit(out strErrMsg) == false)
                            {
                                throw new ApplicationException("BatchCommit Error: " + strErrMsg);
                            }

                            m_dtLast = dtToday;
                        }
                        catch (Exception e)
                        {
                            this.Logger.Write("Synchronization Error : " + e.Message);

                            dataManager.BatchRollback(out strErrMsg);

                        }


                    }                    
                }
                catch (Exception e)
                {
                    this.Logger.Write("SynchronizationThread() Exception : " + e.Message);
                }

                Thread.Sleep(1000 * 60 * 60);
            }
        }
    }
}

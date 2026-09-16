using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSensorServer;
using Kftc.Model.History;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LampusTech
{
    class LampusTechManager : SensorServer
    {
        private static LampusTechManager m_processManager = null;
        private DBManager m_dbManager = null;

        private bool m_closeApp = false;      

        private LampusTechManager(string strFilePath, string strID, string strPW)
           : base("Patrol\\LampusTech")
        {
            // 파일 존재 확인
            if (!File.Exists(strFilePath))
            {
                this.Logger.Write($"파일을 찾을 수 없습니다: {strFilePath}");
                return;
            }

            m_dbManager = new DBManager(this, strFilePath, strID, strPW);
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

            Thread t = new Thread(() => m_processManager.WatchPatrolThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static LampusTechManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // IP, Port 정보 필요
            string strFilePath = ConfigurationManager.AppSettings.Get("FilePath");
            string strID = ConfigurationManager.AppSettings.Get("ID");
            string strPW = ConfigurationManager.AppSettings.Get("PW");

            return new LampusTechManager(strFilePath, strID, strPW);
        }

        private void WatchPatrolThread()
        {
            m_closeApp = false;
            int nLastNo = 0;
            int nLastCount = 0;

            PartrolDB firstData = null;

            while (m_closeApp == false)
            {
                try
                {
                    // ACCESS DB 최신 데이터 READ
                    List<PartrolDB> partrolDatas = m_dbManager.GetPartrolData(nLastNo, nLastCount, ref firstData, out string strErrorMessage);
                    if (partrolDatas == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    List<PartrolData> partrols = m_dbManager.ParsingPartrolData(partrolDatas, out strErrorMessage);
                    if (partrols == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    // UNE DB 데이터 WRITE
                    if (UpdatePartrolData(partrols, ref nLastNo, out strErrorMessage) == false)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }
                }
                catch (Exception e)
                {
                    this.Logger.Write("WatchPatrolThread() Exception : " + e.Message);
                }

                Thread.Sleep(20000);
            }
        }

        private bool UpdatePartrolData(List<PartrolData> partrols, ref int nLastNo, out string strErrorMessage)
        {
            strErrorMessage = "";
            bool bRet = true;

            DataManager clone = this.DataManager.Clone() as DataManager;
            if (clone == null)
            {
                strErrorMessage = "DataManager Clone() Null Error";
                return false;
            }

            int _nLastNo = nLastNo;

            try
            {                              
                if (partrols.Count > 0)
                {
                    if (clone.BeginBatch(out strErrorMessage) == false)
                        throw new ApplicationException(strErrorMessage);

                    foreach (PartrolData partrol in partrols)
                    {
                        // Partrol 추가
                        Patrol _patrol = new Patrol();
                        _patrol.patrl_tm = partrol.DATE;
                        _patrol.patrl_cours_name = partrol.COURSE_NM;
                        _patrol.patrl_wrkr_name = partrol.RANGER_NM;

                        if (clone.GetCreate().Insert<Patrol>(_patrol, out strErrorMessage) == false)
                        {
                            throw new ApplicationException(strErrorMessage);
                        }

                        string strConditions = $"{Patrol.Fields.patrl_tm} = '{partrol.DATE.ToString("yyyy-MM-dd HH:mm:ss")}' AND {Patrol.Fields.patrl_cours_name} = '{partrol.COURSE_NM}' AND {Patrol.Fields.patrl_wrkr_name} = '{partrol.RANGER_NM}' ORDER BY {Patrol.Fields.patrl_hist_sn} DESC";

                        Patrol parent = clone.GetSelect().SelectFirst<Patrol>(strConditions, out strErrorMessage);
                        if (parent == null)
                        {
                            throw new ApplicationException(strErrorMessage);
                        }

                        // PartrolCourse 추가
                        foreach (PartrolCourse course in partrol.courses)
                        {
                            PatrolCourse _course = new PatrolCourse();
                            _course.patrl_hist_sn = parent.patrl_hist_sn;
                            _course.patrl_cours_name = course.COURSE_NM;
                            _course.patrl_place = course.PLACE_NM;
                            _course.patrl_place_tm = course.DATE;

                            if (clone.GetCreate().Insert<PatrolCourse>(_course, out strErrorMessage) == false)
                            {
                                throw new ApplicationException(strErrorMessage);
                            }

                            _nLastNo = course.PATROL_SEQ;
                        }                        
                    }

                    if (clone.BatchCommit(out strErrorMessage) == false)
                    {
                        strErrorMessage = $"BatchCommit Error : {strErrorMessage}";
                        return false;
                    }

                    nLastNo = _nLastNo;
                }

            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;

                if (clone.BatchRollback(out string rollbackMsg) == false)
                {
                    strErrorMessage += $" (Rollback Error: {rollbackMsg})";
                }

                bRet = false;
            }

            return bRet;
        }
    }

    
}


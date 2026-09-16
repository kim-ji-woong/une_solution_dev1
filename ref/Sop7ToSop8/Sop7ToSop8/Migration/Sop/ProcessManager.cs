using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Component;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class ProcessManager
    {
        private const int AddNumber = 10000;
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public ProcessManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 임무 데이터를 읽어옵니다.");
            string strErrorMessage;

            IDataManager dataManager = m_client.Sop8DataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            if (ReadSop7(dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            m_client.SendStatus("SOP 임무 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, GridID, GridRowIndex, GridColumnIndex, text, TeamList, ComponentID, onlyTeamLeader, StepMemberID, AutoRun, SectionNumber from SopComponentProcess";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            strSQL = "Select ID, MissionText, ProcessID from SopComponentProcessMission";
            IEnumerable<dynamic> arrMissionResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrMissionResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + Component.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " OFF", out strErrorMessage) == false)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + ProcessMission.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ProcessMission.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrMissionResults)
            {
                if (CreateMissions(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ProcessMission.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ProcessMission.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            if (ComponentManager.CreateComponent(dataManager, dnsData.CommonCode.Sop.ComponentType.Process, AddNumber, data, out strErrorMessage) == false)
                return false;

            Process section = new Process();
            section.compn_sn = data.ID + AddNumber;
            section.title = data.text;
            section.leadr_prvuse_yn = data.onlyTeamLeader;
            section.atmc_execut_yn = data.AutoRun;
            section.execut_no = data.SectionNumber;

            if (dataManager.GetCreate().Insert<Process>(section, out strErrorMessage))
            {
                return CreateReceiver(dataManager, section, data, out strErrorMessage);
            }

            return false;
        }

        private bool CreateReceiver(IDataManager dataManager, Process section, dynamic data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.TeamList == null)
                return true;

            string[] tokens = data.TeamList.Trim().Split(',');

            foreach (string strToken in tokens)
            {
                int index1 = strToken.IndexOf('(');
                int index2 = strToken.IndexOf(')');

                if (index1 < 0 || index2 <= index1)
                    continue;

                string strTeamID = strToken.Substring(0, index1).Trim();
                string strTeamType = strToken.Substring(index1 + 1, index2 - index1 - 1).Trim();

                int teamID, teamType;

                if (int.TryParse(strTeamID, out teamID) && int.TryParse(strTeamType, out teamType))
                {
                    if (teamType == 2 || teamType == 4)
                    {
                        if (CreateRegularTeam(dataManager, section, teamID, out strErrorMessage) == false)
                            return false;
                    }
                    else if (teamType == 0 || teamType == 1)
                    {
                        if (CreateTemporaryTeam(dataManager, section, teamID, out strErrorMessage) == false)
                            return false;
                    }
                }
            }

            return true;
        }

        private bool CreateRegularTeam(IDataManager dataManager, Process section, int teamID, out string strErrorMessage)
        {
            ProcessRegular regular = new ProcessRegular();
            regular.compn_sn = section.compn_sn;
            regular.rgl_sn = teamID;

            return dataManager.GetCreate().Insert<ProcessRegular>(regular, out strErrorMessage);
        }

        private bool CreateTemporaryTeam(IDataManager dataManager, Process section, int teamID, out string strErrorMessage)
        {
            ProcessTemporary temporary = new ProcessTemporary();
            temporary.compn_sn = section.compn_sn;
            temporary.tmpr_sn = teamID;

            return dataManager.GetCreate().Insert<ProcessTemporary>(temporary, out strErrorMessage);
        }

        private bool CreateMissions(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            ProcessMissionEx mission = new ProcessMissionEx();
            mission.misn_sn = data.ID;
            mission.misn_contents = data.MissionText;
            mission.compn_sn = data.ProcessID + AddNumber;

            return dataManager.GetCreate().Insert<ProcessMissionEx>(mission, out strErrorMessage);
        }

        public static int GetSectionNumber(int sop7ID)
        {
            return sop7ID + AddNumber;
        }
    }
}

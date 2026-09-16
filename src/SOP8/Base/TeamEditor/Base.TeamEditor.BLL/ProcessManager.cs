using Base.TeamEditor.IBLL;
using Base.TeamEditor.IBLL.Request;
using Base.TeamEditor.IBLL.Response;
using Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;

namespace Base.TeamEditor.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDisplayTemporaryMember DisplayTemporaryMember(DisplayTemporaryMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.DisplayTemporaryMember(data);
        }

        public ResponseJobLevels LoadJobLevel()
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadJobLevel();
        }

        public ResponseJobPositions LoadJobPosition()
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadJobPosition();
        }

        public ResponseDisplayRegularMember LoadRegularMembers(DisplayRegularMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadRegularMembers(data);
        }

        public ResponseDisplayRegular LoadRegulars(int? siteNo)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadRegulars(siteNo);
        }

        public ResponseDisplayTemporary LoadTemporaries(bool isNormal, int? siteNo)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadTemporaries(isNormal, siteNo);
        }

        public ResponseTemporaryMembers LoadTemporaryMembers()
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadTemporaryMembers();
        }

        public MessageResult RemoveRegularMembers(RequestRemoveRegularMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.RemoveRegularMembers(data);
        }

        public MessageResult RemoveRegularTeams(RequestRemoveRegularTeam data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.RemoveRegularTeams(data);
        }

        public MessageResult RemoveTemporaryMembers(RequestRemoveTemporaryMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.RemoveTemporaryMembers(data);
        }

        public MessageResult RemoveTemporaryTeams(RequestRemoveTemporaryTeam data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.RemoveTemporaryTeams(data);
        }

        public MessageResult SaveUpdateData(RequestSaveUpdateData data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.SaveUpdateData(data);
        }

        public ResponseUpdateRegularMember UpdateRegularMember(RequestUpdateRegularMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.UpdateRegularMember(data);
        }

        public ResponseUpdateRegularTeam UpdateRegularTeam(RequestUpdateRegularTeam data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.UpdateRegularTeam(data);
        }

        public ResponseUpdateTemporaryMember UpdateTemporaryMember(RequestUpdateTemporaryMember data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.UpdateTemporaryMember(data);
        }

        public ResponseUpdateTemporaryTeam UpdateTemporaryTeam(RequestUpdateTemporaryTeam data)
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.UpdateTemporaryTeam(data);
        }

        public ResponseTemporaryRoleList LoadTemporaryRoleList()
        {
            TeamManager teamManager = new TeamManager(m_dataManager);
            return teamManager.LoadTemporaryRoleList();
        }

        public ResponseExcelInfo DownloadExcelRegularTeam(RequestDownloadRegularTeam data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadRegularTeam(data);
        }

        public MessageResult UploadRegularTeam(string strFilePath, int? siteNo)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.UploadRegularTeam(strFilePath, siteNo);
        }
    }
}

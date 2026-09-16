using Response;
using dnsExcelReport.Models;

namespace Base.TeamEditor.IBLL
{
    using Response;
    using Request;

    public interface IProcessManager
    {
        ResponseDisplayRegular LoadRegulars(int? siteNo);
        ResponseDisplayRegularMember LoadRegularMembers(DisplayRegularMember data);
        ResponseDisplayTemporary LoadTemporaries(bool isNormal, int? siteNo);
        ResponseDisplayTemporaryMember DisplayTemporaryMember(DisplayTemporaryMember data);
        ResponseTemporaryMembers LoadTemporaryMembers();
        MessageResult SaveUpdateData(RequestSaveUpdateData data);
        ResponseJobLevels LoadJobLevel();
        ResponseJobPositions LoadJobPosition();
        ResponseUpdateRegularMember UpdateRegularMember(RequestUpdateRegularMember data);
        MessageResult RemoveRegularMembers(RequestRemoveRegularMember data);
        ResponseUpdateTemporaryMember UpdateTemporaryMember(RequestUpdateTemporaryMember data);
        MessageResult RemoveTemporaryMembers(RequestRemoveTemporaryMember data);
        ResponseUpdateRegularTeam UpdateRegularTeam(RequestUpdateRegularTeam data);
        MessageResult RemoveRegularTeams(RequestRemoveRegularTeam data);
        ResponseUpdateTemporaryTeam UpdateTemporaryTeam(RequestUpdateTemporaryTeam data);
        MessageResult RemoveTemporaryTeams(RequestRemoveTemporaryTeam data);
        ResponseTemporaryRoleList LoadTemporaryRoleList();
        ResponseExcelInfo DownloadExcelRegularTeam(RequestDownloadRegularTeam data);
        MessageResult UploadRegularTeam(string strFilePath, int? siteNo);
    }
}

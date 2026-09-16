using Response;
using dnsExcelReport.Models;

namespace Base.Settings.IBLL
{
    using Request;
    using Response;

    public interface IProcessManager
    {
        ResponseSettingDatas RequestSettingData(RequestSettingDatas data);
        ResponseSettingDatas RequestSettingDataList(RequestSettingDataList data);
        MessageResult Save(RequestSave data);
        MessageResult Initialize(RequestInitialize data);
        ResponseExcelInfo DownloadBuildingGroupData(RequestDownloadBuildingGroupData data);
        ResponseExcelInfo DownloadBuildingData(RequestDownloadBuildingData data);
        MessageResult UploadBuildingGroupData(string strFilePath, int? siteNo);
        MessageResult UploadBuildingData(string strFilePath, int? siteNo);
    }
}

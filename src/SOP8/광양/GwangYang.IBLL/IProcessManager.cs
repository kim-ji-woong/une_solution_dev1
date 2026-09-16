using Response;
using dnsExcelReport.Models;
using Base.TeamEditor.IBLL.Request;

namespace Gwangyang.IBLL
{
    using Request;
    using Response;

    public interface IProcessManager
    {
        ResponseExternalSensorTypes RequestExternalSensorTypes(RequestExternalSensorTypes data);
        
        ResponseExternalSensorCategories RequestExternalSensorCategories(RequestExternalSensorCategories data);
        
        ResponseExternalSensorLink RequestExternalSensorLink();
        
        ResponseExternalPOIInfo RequestExternalPOIInfo();
        
        ResponseCCTVInfo RequestCCTVInfo(RequestCCTVInfo data);
        
        ResponseExternalSensorTypeSubTypes RequestExternalSensorTypeSubTypes();
        
        ResponseExternalSensorHistories RequestExternalSensorHistories(RequestExternalSensorHistories data);
        
        ResponseSensorSubTypes RequestSensorSubTypes();
        
        ResponseExternalMaterialLinks RequestExternalMaterialLinks();
        
        ResponseWeatherData RequestExternalWeatherData();

        ResponseExcelInfo DownloadExcelRegularTeam(RequestDownloadRegularTeam data);
    }
}
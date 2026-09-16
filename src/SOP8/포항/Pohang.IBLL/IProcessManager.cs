namespace Pohang.IBLL
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
        
        ResponseExternalPublicData RequestExternalPublicData();
        
        ResponseConvertSpecialCharacters RequestConvertSpecialCharacters(RequestConvertSpecialCharacters data);
    }
}
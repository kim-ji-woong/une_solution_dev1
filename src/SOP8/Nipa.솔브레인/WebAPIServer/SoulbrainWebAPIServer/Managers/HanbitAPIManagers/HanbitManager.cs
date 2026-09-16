using System;
using System.Net;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Soulbrain.Model.Facility;
using SoulbrainWebAPIServer.Model.HanbitModels;

namespace SoulbrainWebAPIServer.Managers.HanbitAPIManagers
{
    public class HanbitManager
    {
        private HanbitDataManager m_hanbitDataManager;
        
        private const string strError = "error";
        private const string strSuccess = "success";
        
        public HanbitManager (DataManager dataManager, string sopWebServerUrl)
        {
            m_hanbitDataManager = new HanbitDataManager(dataManager, sopWebServerUrl);
        }

        public HanbitResponse ProcessHanbitScannerTagInfo(RequestData.RequestScannerTagInfo scanner)
        {
            HanbitResponse result = new HanbitResponse();

            try
            {
                if (m_hanbitDataManager.ProcessHanbitScannerTagInfo(scanner, out string strErrorMessage) == false)
                {
                    return new HanbitResponse(strError, (int)HttpStatusCode.OK, strErrorMessage);
                }
            }
            catch(Exception ex)
            {
                Logger.Instance.Write($@"ProcessHanbitScannerTagInfo Exception : {ex.Message}");
                return new HanbitResponse(strError, (int)HttpStatusCode.OK, ex.Message);
            }
            
            return result;
        }

        public HanbitResponse ProcessHanbitUnauthData(RequestData.RequestUnauthTagSignal unauthTagSignal)
        {
            HanbitResponse result = new HanbitResponse();

            try
            {
                if (m_hanbitDataManager.ProcessHanbitUnauthData(unauthTagSignal, out string strErrorMessage) == false)
                {
                    return new HanbitResponse(strError, (int)HttpStatusCode.OK, strErrorMessage);
                }
            }
            catch(Exception ex)
            {
                Logger.Instance.Write($@"ProcessHanbitUnauthData Exception : {ex.Message}");
                return new HanbitResponse(strError, (int)HttpStatusCode.OK, ex.Message);
            }
            
            return result;
        }

        public HanbitResponse ProcessSosSignalData(RequestData.RequestSosSignal sos)
        {
            HanbitResponse result = new HanbitResponse();

            try
            {
                if (m_hanbitDataManager.ProcessHanbitSosSignalData(sos, out string strErrorMessage) == false)
                {
                    return new HanbitResponse(strError, (int)HttpStatusCode.OK, strErrorMessage);           
                }
            }
            catch(Exception ex)
            {
                return new HanbitResponse(strError, (int)HttpStatusCode.OK, ex.Message);
            }
            
            return result;
        }
    }
}
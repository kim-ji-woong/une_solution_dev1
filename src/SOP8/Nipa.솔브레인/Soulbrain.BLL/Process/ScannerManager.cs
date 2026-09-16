using System;
using System.Collections.Generic;
using System.Linq;
using Base.Model.History;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using Soulbrain.Model.Facility;
using Soulbrain.Model.History;

namespace Soulbrain.BLL.Process
{
    using Request;
    using Response;
    
    public class ScannerManager
    {
        private IDataManager m_dataManager = null;

        public ScannerManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }
        
        public ResponseScannerInfo RequestScannerInfo(RequestScannerInfo data)
        {
            try
            {
                if (data.ScannerId == null || data.ScannerId <= 0)
                {
                    ResponseScannerInfo response = GetAllScannerStatusInfo();
                    return response;
                }
                else
                {
                    ResponseScannerInfo response = GetSingularScannerStatusInfo(data.ScannerId);
                    return response;
                }
            }
            catch (Exception e)
            {
                return new ResponseScannerInfo(false, e.Message);
            }
        }

        private ResponseScannerInfo GetSingularScannerStatusInfo(int? scannerId)
        {
            string strScannerCondition = $@"{Scanner.Fields.scnr_sn} = {scannerId}";
            
            Scanner scnr = m_dataManager.GetSelect().SelectFirst<Scanner>(strScannerCondition, out string strErrorMessage);
                
            if (scnr == null)
                return new ResponseScannerInfo(false, strErrorMessage);
            
            ResponseScannerInfo response = new ResponseScannerInfo();
            ScannerStatus scnrStatus = new ScannerStatus(scnr);
            scnrStatus.ScannerCurrentTagInfos = GetScannerCurrentTagInfos(scnr.scnr_sn);
            response.Scanners.Add(scnrStatus);
            response.Success = true;
            return response;
        }

        private ResponseScannerInfo GetAllScannerStatusInfo()
        {
            IEnumerable<Scanner> scanners = m_dataManager.GetSelect().Select<Scanner>(null, out string strErrorMessage);
            
            if (scanners == null)
                return new ResponseScannerInfo(false, strErrorMessage);
            
            ResponseScannerInfo response = new ResponseScannerInfo();
            foreach (Scanner scnr in scanners)
            {
                ScannerStatus scnrStatus = new ScannerStatus(scnr);
                scnrStatus.ScannerCurrentTagInfos = GetScannerCurrentTagInfos(scnr.scnr_sn);
                response.Scanners.Add(scnrStatus);
            }
            response.Success = true;
            return response;
        }

        public List<ScannerCurrentTagInfo> GetScannerCurrentTagInfos(int scannerId)
        {
            string strScannerCondition = $@"{ScannerCurrentTagInfo.Fields.scnr_sn} = {scannerId}";
            
            IEnumerable<ScannerCurrentTagInfo> tagInfos = m_dataManager.GetSelect().Select<ScannerCurrentTagInfo>(strScannerCondition, out string strErrorMessage);
            
            if (tagInfos == null)
                return null;
            
            return tagInfos.ToList();
        }

        public ResponseScannerTagInfo RequestScannerTagInfo(RequestScannerTagInfo data)
        {
            string strConditions = $@"{ScannerTag.Fields.scnr_tag_hist_sn} = 
                                    (
                                        Select {SensorReaction.Fields.sensor_value}
                                            From {SensorReaction.TableName}
                                                Where {SensorReaction.Fields.react_ty_code} = {History.ReactionType.BeginStatus}
                                                  And {SensorReaction.Fields.sensor_zone_hist_sn} = {data.SensorZoneHistoryNo}
                                    )";
            
            ScannerTag tag = m_dataManager.GetSelect().SelectFirst<ScannerTag>(strConditions, out string strErrorMessage);

            if (tag == null)
            {
                if (strErrorMessage?.Length > 0)
                    return new ResponseScannerTagInfo(false, strErrorMessage);
                
                return new ResponseScannerTagInfo(false, "파라미터 값에 일치하는 정보가 없습니다.");
            }
            
            return new ResponseScannerTagInfo(true, "", tag);
        }

        public ResponseScannerEmergencyInfo RequestScannerEmergencyInfo(RequestScannerEmergencyInfo data)
        {
            string strConditions = $@"{ScannerEmergency.Fields.scnr_emgnc_hist_sn} = 
                                    (
                                        Select {SensorReaction.Fields.sensor_value}
                                            From {SensorReaction.TableName}
                                                Where {SensorReaction.Fields.react_ty_code} = {History.ReactionType.BeginStatus}
                                                  And {SensorReaction.Fields.sensor_zone_hist_sn} = {data.SensorZoneHistoryNo}
                                    )";
            
            ScannerEmergency emergency = m_dataManager.GetSelect().SelectFirst<ScannerEmergency>(strConditions, out string strErrorMessage);

            if (emergency == null)
            {
                if (strErrorMessage?.Length > 0)
                    return new ResponseScannerEmergencyInfo(false, strErrorMessage);
                
                return new ResponseScannerEmergencyInfo(false, "파라미터 값에 일치하는 정보가 없습니다.");
            }
            
            return new ResponseScannerEmergencyInfo(true, "", emergency);
        }
    }
}
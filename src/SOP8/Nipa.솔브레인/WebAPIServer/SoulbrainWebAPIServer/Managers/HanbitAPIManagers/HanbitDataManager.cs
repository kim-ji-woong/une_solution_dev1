using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDataSoulbrain.CommonCode;
using Soulbrain.Model.Facility;
using Soulbrain.Model.History;
using SoulbrainWebAPIServer.Model.HanbitModels;

namespace SoulbrainWebAPIServer.Managers.HanbitAPIManagers
{
    public class HanbitDataManager
    {
        AlarmManager m_alarmManager;
        DataManager m_dataManager;
        
        private string m_strSOPWebServerUrl;
        private const int SENSOR_SUB_TYPE_UNAUTH = 268;
        private const int SENSOR_SUB_TYPE_SOS = 269;
        
        public HanbitDataManager(DataManager dataManager, string strSOPWebServerUrl)
        {
            m_dataManager = dataManager;
            m_strSOPWebServerUrl = strSOPWebServerUrl;
            m_alarmManager = new AlarmManager();
        }

        public bool ProcessHanbitScannerTagInfo(RequestData.RequestScannerTagInfo scanner, out string strErrorMessage)
        {
            if (UpdateScannerTagCount(scanner.ScannerMac, scanner.TagCount, scanner.TagAuth, scanner.TagUnauth, out int scannerSn, out strErrorMessage) == false)
            {
                return false;
            }

            if (UpdateScannerTagInfo(scanner.TagData, scannerSn, out strErrorMessage) == false)
            {
                return false;
            }
                
            return true;
        }

        public bool ProcessHanbitUnauthData(RequestData.RequestUnauthTagSignal unauthTagSignal, out string strErrorMessage)
        {
            if (ProcessHanbitUnauthAlarm(unauthTagSignal, out strErrorMessage) == false)
            {
                return false;
            }
            
            return true;
        }

        public bool ProcessHanbitSosSignalData(RequestData.RequestSosSignal sosSignal, out string strErrorMessage)
        {
            if (ProcessHanbitSosAlarm(sosSignal, out strErrorMessage) == false)
            {
                return false;
            }
            
            return true;
        }

        private bool UpdateScannerTagCount(string scannerMac, int tagCount, int tagAuth, int tagUnauth, out int scannerSn, out string strErrorMessage)
        {
            string strCondition = $@"{Scanner.Fields.scnr_macaddr} = '{scannerMac}'";
            
            scannerSn = 0;

            try
            {
                IEnumerable<Scanner> scs = m_dataManager.GetSelect().Select<Scanner>(strCondition, out strErrorMessage);

                List<Scanner> scanners = scs.ToList();

                if (scanners.Count == 0)
                {
                    strErrorMessage = $"No scanners found in Une Database Scanner MacAddr : {scannerMac}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }

                Scanner? targetScanner = scanners.FirstOrDefault(s => s.scnr_macaddr == scannerMac);

                if (targetScanner == null)
                {
                    strErrorMessage = $"No Matched scanner found in Une Database Scanner MacAddr : {scannerMac}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                scannerSn = targetScanner.scnr_sn;
                targetScanner.tag_co = tagCount;
                targetScanner.tag_prmisn_co = tagAuth;
                targetScanner.tag_nnpmsn_co = tagUnauth;
                
                string strUpdateQuery = $@"Update {Scanner.TableName} 
                                                    Set {Scanner.Fields.tag_co} = {targetScanner.tag_co}, 
                                                        {Scanner.Fields.tag_prmisn_co} = {targetScanner.tag_prmisn_co}, 
                                                        {Scanner.Fields.tag_nnpmsn_co} = {targetScanner.tag_nnpmsn_co} 
                                                    Where {Scanner.Fields.scnr_sn} = {scannerSn} ";
                
                if (m_dataManager.GetUpdate().Update(strUpdateQuery, out strErrorMessage) == false)
                {
                    strErrorMessage = $"Update Scanner Tag Count Error : {strErrorMessage}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                Logger.Instance.Write($@"UpdateScannerTagCount Exception : {ex.Message}");
                return false;
            }
            

            return true;
        }

        private bool UpdateScannerTagInfo(List<RequestData.RequestScannerTagInfo.CurrentTagInfo> scannerTagInfos, int scannerSn, out string strErrorMessage)
        {
            string strCondition = $@"{Scanner.Fields.scnr_sn} = {scannerSn}";

            if (m_dataManager.GetDelete().Delete<ScannerCurrentTagInfo>(strCondition, out strErrorMessage) == false)
            {
                return false;
            }
            
            StringBuilder sbInsert = new StringBuilder();

            foreach (RequestData.RequestScannerTagInfo.CurrentTagInfo tagInfo in scannerTagInfos)
            {
                string strInsert = $@"Insert Into {ScannerCurrentTagInfo.TableName}
                                               ({ScannerCurrentTagInfo.Fields.scnr_sn}, 
                                               {ScannerCurrentTagInfo.Fields.tag_macaddr}, 
                                               {ScannerCurrentTagInfo.Fields.tag_user_name}, 
                                               {ScannerCurrentTagInfo.Fields.tag_user_brthdy}, 
                                               {ScannerCurrentTagInfo.Fields.tag_user_telno}, 
                                               {ScannerCurrentTagInfo.Fields.tag_user_cmpny_name}, 
                                               {ScannerCurrentTagInfo.Fields.tag_lc}, 
                                               {ScannerCurrentTagInfo.Fields.purps}, 
                                               {ScannerCurrentTagInfo.Fields.charger_name}, 
                                               {ScannerCurrentTagInfo.Fields.prmisn_yn}, 
                                               {ScannerCurrentTagInfo.Fields.emgnc_yn})
                                      Values (
                                               {scannerSn},
                                               '{tagInfo.TagMac}',
                                               '{tagInfo.Name}',
                                               '{tagInfo.Birth}',
                                               '{tagInfo.Mobile}',
                                               '{tagInfo.Company}',
                                               '{tagInfo.Location}',
                                               '{tagInfo.Purpose}',
                                               '{tagInfo.ManagerName}',
                                               '{tagInfo.Auth}',
                                               '{tagInfo.SOS}');
                                    ";
                
                sbInsert.Append(strInsert);
                sbInsert.AppendLine("");
            }

            if (m_dataManager.GetDBManager().Excute(sbInsert.ToString(), out strErrorMessage) == false)
            {
                strErrorMessage = $"Update Scanner Tag Info Error : {strErrorMessage}";
                Logger.Instance.Write(strErrorMessage);
                return false;
            }
            
            return true;
        }
        
        private bool ProcessHanbitUnauthAlarm(RequestData.RequestUnauthTagSignal unauthTagSignal, out string strErrorMessage)
        {
            int scannerSn = GetScannerSnFromMacAddr(unauthTagSignal.ScannerMac, out strErrorMessage);

            if (scannerSn == -1)
            {
                strErrorMessage = $"No Matched scanner found in Une Database Scanner MacAddr : {unauthTagSignal.ScannerMac}";
                Logger.Instance.Write(strErrorMessage);
                return false;
            }
            
            try
            {
                ScannerTag tag = new ScannerTag();
                tag.scnr_sn = scannerSn;
                tag.tag_macaddr = unauthTagSignal.TagMac;
                tag.tag_user_name = unauthTagSignal.Name;
                tag.tag_user_brthdy = unauthTagSignal.Birth;
                tag.tag_user_telno = unauthTagSignal.Mobile;
                tag.tag_user_cmpny_name = unauthTagSignal.Company;
                tag.tag_lc = unauthTagSignal.Location;
                tag.purps = unauthTagSignal.Purpose;
                tag.charger_name = unauthTagSignal.ManagerName;
                tag.prmisn_yn = false;
                tag.buld_name = unauthTagSignal.BuildingName;
                tag.fctry_name = unauthTagSignal.FactoryName;
                tag.floor_name = unauthTagSignal.FloorName;
                tag.tm = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second);
                
                if (m_dataManager.GetCreate().Insert(tag, out int addhistorySn, out strErrorMessage) == false)
                {
                    strErrorMessage = $"Insert History.ScannerTag Error : {strErrorMessage}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }

                int nSensorZoneSn = GetSensorZoneSnFromScannerSn(tag.scnr_sn, SENSOR_SUB_TYPE_UNAUTH, out strErrorMessage);

                if (nSensorZoneSn == -1)
                {
                    strErrorMessage = $"No Matched Sensor Zone Found ScannerSn : {tag.scnr_sn}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                string strHistorySn = addhistorySn.ToString();

                if (String.IsNullOrEmpty(m_strSOPWebServerUrl))
                {
                    strErrorMessage = "SOP Web Server Url is null";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                string strSignalUrl = GetSendAlarmSOPWebServerUrl(out strErrorMessage);                
                
                if (m_alarmManager.SendSensorAlarm(SdmsSensor.SensorType.MovingScaner, nSensorZoneSn, true, strHistorySn, strSignalUrl, 4, null, out strErrorMessage) == false)
                {
                    Logger.Instance.Write($@"SendSensorAlarm Exception : {strErrorMessage}");
                    return false;
                }
                
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                Logger.Instance.Write($@"ProcessHanbitUnauthAlarm Exception : {ex.Message}");
                return false;
            }
        }

        private bool ProcessHanbitSosAlarm(RequestData.RequestSosSignal sosSignal, out string strErrorMessage)
        {
            int scannerSn = GetScannerSnFromMacAddr(sosSignal.ScannerMac, out strErrorMessage);

            if (scannerSn == -1)
            {
                strErrorMessage = $"No Matched scanner found in Une Database Scanner MacAddr : {sosSignal.ScannerMac}";
                Logger.Instance.Write(strErrorMessage);
                return false;
            }
            
            try
            {
                ScannerEmergency sos = new ScannerEmergency();
                sos.scnr_sn = scannerSn;
                sos.tag_macaddr = sosSignal.TagMac;
                sos.tag_user_name = sosSignal.Name;
                sos.tag_user_brthdy = sosSignal.Birth;
                sos.tag_user_telno = sosSignal.Mobile;
                sos.tag_user_cmpny_name = sosSignal.Company;
                sos.tag_lc = sosSignal.Location;
                sos.purps = sosSignal.Purpose;
                sos.charger_name = sosSignal.ManagerName;
                sos.buld_name = sosSignal.BuildingName;
                sos.fctry_name = sosSignal.FactoryName;
                sos.floor_name = sosSignal.FloorName;
                sos.emgnc_yn = true;
                sos.tm = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second);

                if (m_dataManager.GetCreate().Insert(sos, out int addhistorySn, out strErrorMessage) == false)
                {
                    strErrorMessage = $"Insert History.ScannerEmergency Error : {strErrorMessage}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                string strHistorySn = addhistorySn.ToString();
                
                int nSensorZoneSn = GetSensorZoneSnFromScannerSn(scannerSn, SENSOR_SUB_TYPE_SOS, out strErrorMessage);

                if (nSensorZoneSn == -1)
                {
                    strErrorMessage = $"No Matched Sensor Zone Found ScannerSn : {scannerSn}";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                if (String.IsNullOrEmpty(m_strSOPWebServerUrl))
                {
                    strErrorMessage = "SOP Web Server Url is null";
                    Logger.Instance.Write(strErrorMessage);
                    return false;
                }
                
                string strSignalUrl = GetSendAlarmSOPWebServerUrl(out strErrorMessage);
                
                if (m_alarmManager.SendSensorAlarm(SdmsSensor.SensorType.MovingScaner, nSensorZoneSn, true, strHistorySn, strSignalUrl, 4, null, out strErrorMessage) == false)
                {
                    Logger.Instance.Write($@"SendSensorAlarm Exception : {strErrorMessage}");
                    return false;
                }
                
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                Logger.Instance.Write($@"ProcessHanbitSosAlarm Exception : {ex.Message}");
                return false;
            }
        }

        private int GetScannerSnFromMacAddr(string strMacAddr, out string strErrorMessage)
        {
            try
            {
                string strConditon = $@"{Scanner.Fields.scnr_macaddr} = '{strMacAddr}'";
            
                IEnumerable<Scanner> scanners = m_dataManager.GetSelect().Select<Scanner>(strConditon, out strErrorMessage);
                
                return scanners.FirstOrDefault()?.scnr_sn ?? -1;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                Logger.Instance.Write($@"GetScannerSnFromMacAddr Exception : {ex.Message}");
                return -1;
            }
        }
        
        private int GetSensorZoneSnFromScannerSn(int scannerSn, int sensorSubType, out string strErrorMessage)
        {
            try
            {
                string strQuery = $@"
                                    Select {SensorZone.Fields.sensor_zone_sn}
                                        From {SensorZone.TableName}
                                            Where (1=1)
                                            And {SensorZone.Fields.sensor_sub_ty_no} = {sensorSubType}
                                            And {SensorZone.Fields.sensor_sn} = 
                                            (
                                                Select {Scanner.Fields.sensor_sn} 
                                                    From {Scanner.TableName} 
                                                        Where {Scanner.Fields.scnr_sn} = {scannerSn}
                                            )
                                ";

                IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);

                if (result == null)
                {
                    strErrorMessage = $"No Sensor Zone Found / Query : {strQuery}";
                    Logger.Instance.Write(strErrorMessage);
                    return -1;
                }

                return result.FirstOrDefault()?.sensor_zone_sn ?? -1;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                Logger.Instance.Write($@"GetSensorZoneSnFromScannerSn Exception : {ex.Message}");
                return -1;
            }
        }

        private string GetSendAlarmSOPWebServerUrl(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            if (string.IsNullOrEmpty(m_strSOPWebServerUrl))
            {
                strErrorMessage = "SOP Web Server Url is null : m_strSOPWebServerUrl = " + m_strSOPWebServerUrl;
                Logger.Instance.Write(strErrorMessage);
                return "";
            }
            
            if (m_strSOPWebServerUrl.EndsWith("/") == false)
                return m_strSOPWebServerUrl + "/api/Sensor/RequestSensorSignal";
            else 
                return m_strSOPWebServerUrl + "api/Sensor/RequestSensorSignal";
        }
        
    }
}
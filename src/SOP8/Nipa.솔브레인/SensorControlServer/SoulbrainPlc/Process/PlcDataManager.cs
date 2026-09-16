using System;
using System.Collections.Generic;
using System.Linq;

using Base.Model.Alarm;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using dnsPipeHelper;
using Response;
using Soulbrain.Model.Facility;
using SoulbrainPlc.Data;
using DustMeasurement = Soulbrain.Model.History.DustMeasurement;
using WaterGather = Soulbrain.Model.History.WaterGather;

namespace SoulbrainPlc.Process
{
    public class PlcDataManager
    {
        private IDataManager m_dataManager = null;
        private PlcManager m_parent = null;

        private const int PM10 = 270;
        private const int PH = 275;
        
        private readonly int DustMeasurementType = 300322;
        private readonly int WaterGatherType = 300324;

        
        public PlcDataManager(IDataManager dataManager, PlcManager parent)
        {
            m_dataManager = dataManager;
            m_parent = parent;
        }

        public bool ProcessPlcData(DateTime dtReadMoment, DateTime dt, string[] values)
        {
            DataRow dataRow = new DataRow();

            try
            {

                // 포장실
                AirPollutionData packaging = new AirPollutionData()
                {
                    MsrrLocationSn = 2,
                    VlnmsValue = double.TryParse(values[0], out double dVlnmsValue) ? dVlnmsValue : 0,
                    Co2Value = double.TryParse(values[1], out double dCo2Value) ? dCo2Value : 0,
                    UlFptcValue = double.TryParse(values[2], out double dUlFptcValue) ? dUlFptcValue : 0,
                    FptcValue = double.TryParse(values[3], out double dFptcValue) ? dFptcValue : 0,
                    ExrfnOprYn = values[4] == "1"
                };

                dataRow.AirPollutionDataList.Add(packaging);

                // 원료 투입실
                AirPollutionData rawMaterial = new AirPollutionData()
                {
                    MsrrLocationSn = 1,
                    VlnmsValue = double.TryParse(values[5], out double dVlnmsValue2) ? dVlnmsValue2 : 0,
                    Co2Value = double.TryParse(values[6], out double dCo2Value2) ? dCo2Value2 : 0,
                    UlFptcValue = double.TryParse(values[7], out double dUlFptcValue2) ? dUlFptcValue2 : 0,
                    FptcValue = double.TryParse(values[8], out double dFptcValue2) ? dFptcValue2 : 0,
                    ExrfnOprYn = values[9] == "1"
                };
                
                dataRow.AirPollutionDataList.Add(rawMaterial);

                WaterGatherData wgd = new WaterGatherData()
                {
                    WgrSn = 1,
                    FlugtOpnRate = double.TryParse(values[10], out double dFlugtOpnRate) ? dFlugtOpnRate / 10 : 0,
                    HydroIonDnsty = double.TryParse(values[11], out double dHydroIonDnsty) ? dHydroIonDnsty / 100 : 0
                };

                dataRow.WaterGatherData = wgd;

                dataRow.DateTime = dt;
                
                if (SavePlcData(dataRow, dtReadMoment) == false)
                    return false;

                return true;
            }
            catch (Exception e)
            {
                m_parent.Logger.Write("ProcessPlcData Exception : " + e.Message);
                return false;
            }
        }

        private bool SavePlcData(DataRow dataRow, DateTime dtReadMoment)
        {
            try
            {
                List<DustMeasurement> dustMeasurements = dataRow.ConvertToDustMeasurement(dataRow);
                
                WaterGather waterGather = dataRow.ConvertToWaterGather(dataRow);

                if (dustMeasurements.Any() == false && waterGather == null)
                {
                    m_parent.Logger.Write("[Error] PlcDataManager SavePlcData : 이력 데이터를 저장할 수 없습니다.");
                    return false;
                }

                string strErrorMessage;

                // if (dataRow.DateTime.Year == dtReadMoment.Year &&
                //     dataRow.DateTime.Date == dtReadMoment.Date &&
                //     dataRow.DateTime.Hour == dtReadMoment.Hour &&
                //     dataRow.DateTime.Minute == dtReadMoment.Minute )
                // {
                //     m_parent.Logger.Write($" DataRow in PlcDataManager.cs 2 : {dataRow}");
                //     if (!UpdatePlcData(dataRow, out strErrorMessage))
                //     {
                //         m_parent.Logger.Write($@"[Error] PlcDataManager SavePlcData : UpdatePlcData Error : {strErrorMessage}");
                //         return false;
                //     }
                // }
                if (!UpdatePlcData(dataRow, out strErrorMessage))
                {
                    m_parent.Logger.Write($@"[Error] PlcDataManager SavePlcData : UpdatePlcData Error : {strErrorMessage}");
                    return false;
                }

                if (m_dataManager.GetCreate().Insert(dustMeasurements, out strErrorMessage) == false)
                {
                    m_parent.Logger.Write($@"[Error] PlcDataManager SavePlcData : DustMeasurement Insert Error : {strErrorMessage}");
                    return false;
                }
                    
                if (m_dataManager.GetCreate().Insert(waterGather, out strErrorMessage) == false)
                {
                    m_parent.Logger.Write($@"[Error] PlcDataManager SavePlcData : WaterGather Insert Error : {strErrorMessage}");
                    return false;
                }
                
                return true;
            }
            catch (Exception e)
            {
                m_parent.Logger.Write("SavePlcData Exception : " + e.Message);
                return false;
            }
        }
        
        private bool UpdatePlcData(DataRow dataRow, out string strErrorMessage)
        {
            List<AirPollutionData> airPollutionDataList = dataRow.AirPollutionDataList;

            int alarmLevel;
            
            List<Soulbrain.Model.Facility.DustMeasurement> dustMeasurements = new List<Soulbrain.Model.Facility.DustMeasurement>();
            foreach (AirPollutionData apd in airPollutionDataList)
            {
                Soulbrain.Model.Facility.DustMeasurement dm = new Soulbrain.Model.Facility.DustMeasurement();
                dm.dust_msrr_sn = apd.MsrrLocationSn;
                dm.fptc_value = apd.FptcValue;
                dm.ulfptc_value = apd.UlFptcValue;
                dm.co2_value = apd.Co2Value;
                dm.vlnms_value = apd.VlnmsValue;
                dm.exrfn_opr_yn = apd.ExrfnOprYn;
                
                alarmLevel = GetAlarmLevel(dm);

                if (alarmLevel > 2)
                {
                    int sensorZoneSn = GetSensorZoneSn(dm, PM10);

                    if (sensorZoneSn > 0 && IsAlarmed(sensorZoneSn) == false)
                    {
                        MessageResult result = m_parent.SendSensorAlarm(sensorZoneSn, DustMeasurementType, true, null, alarmLevel);
                    
                        if (result.Success == false)
                            m_parent.Logger.Write($"SendSensorAlarm Error : {result.Message}");
                    }
                }

                string strUpdateQuery = $@"Update {Soulbrain.Model.Facility.DustMeasurement.TableName} 
                                                Set {Soulbrain.Model.Facility.DustMeasurement.Fields.exrfn_opr_yn} = {(dm.exrfn_opr_yn == true ? 1 : 0)},
                                                    {Soulbrain.Model.Facility.DustMeasurement.Fields.vlnms_value} = {dm.vlnms_value},
                                                    {Soulbrain.Model.Facility.DustMeasurement.Fields.co2_value} = {dm.co2_value},
                                                    {Soulbrain.Model.Facility.DustMeasurement.Fields.ulfptc_value} = {dm.ulfptc_value},
                                                    {Soulbrain.Model.Facility.DustMeasurement.Fields.fptc_value} = {dm.fptc_value}
                                                Where {Soulbrain.Model.Facility.DustMeasurement.Fields.dust_msrr_sn} = {dm.dust_msrr_sn};
                                                ";

                m_parent.Logger.Write($"Update Dust Sensor Value : exrfn_opr_yn : {dm.exrfn_opr_yn} , vlnms_value : {dm.vlnms_value} , co2_value : {dm.co2_value} , ulfptc_value : {dm.ulfptc_value} , fptc_value : {dm.fptc_value}");
                if (m_dataManager.GetUpdate().Update(strUpdateQuery, out strErrorMessage) == false)
                {
                    m_parent.Logger.Write($@"[Error] Update Dust Sensor Query: {strUpdateQuery}");
                    m_parent.Logger.Write($@"[Error] Update Dust Sensor TableName : {Soulbrain.Model.Facility.DustMeasurement.TableName}");
                    m_parent.Logger.Write($"[Error] Update Dust Sensor Data : {strErrorMessage}");
                    return false;
                }
                
                dustMeasurements.Add(dm);
            }

            Soulbrain.Model.Facility.WaterGather waterGather = new Soulbrain.Model.Facility.WaterGather();
            waterGather.wgr_sn = dataRow.WaterGatherData.WgrSn;
            waterGather.flugt_opn_rate = dataRow.WaterGatherData.FlugtOpnRate;
            waterGather.hydro_ion_dnsty_idex = dataRow.WaterGatherData.HydroIonDnsty;

            string strUpdateWaterQuery = $@"Update {Soulbrain.Model.Facility.WaterGather.TableName} Set
                                        {Soulbrain.Model.Facility.WaterGather.Fields.flugt_opn_rate} = {waterGather.flugt_opn_rate},
                                        {Soulbrain.Model.Facility.WaterGather.Fields.hydro_ion_dnsty_idex} = {waterGather.hydro_ion_dnsty_idex}
                                        Where {Soulbrain.Model.Facility.WaterGather.Fields.wgr_sn} = {waterGather.wgr_sn};
                                        ";

            if (m_dataManager.GetUpdate().Update(strUpdateWaterQuery, out strErrorMessage) == false)
            {
                m_parent.Logger.Write($"[Error] Update Water Sensor Data : {strErrorMessage}");
                return false;
            }

            alarmLevel = GetAlarmLevel(waterGather);
            if (alarmLevel > 0)
            {
                int sensorZoneSn = GetSensorZoneSn(waterGather, PH);

                if (sensorZoneSn > 0 && IsAlarmed(sensorZoneSn) == false)
                {
                    MessageResult result = m_parent.SendSensorAlarm(sensorZoneSn, WaterGatherType, true, null, alarmLevel);
                
                    if (result.Success == false)
                        m_parent.Logger.Write($"SendSensorAlarm Error : {result.Message}");
                }
            }

            return true;
        }

        private int GetAlarmLevel(Soulbrain.Model.Facility.WaterGather waterGather)
        {
            double? ph = waterGather.hydro_ion_dnsty_idex;

            return ph switch
            {
                null => 0,               // 예외 값
                < 5.8 or > 8.6 => 4,     // 심각
                < 6.0 or > 8.0 => 2,     // 주의
                _ => 0                   // 정상 (나머지 범위)
            };
        }

        private int GetAlarmLevel(Soulbrain.Model.Facility.DustMeasurement dustMeasurement)
        {
            double? pm10 = dustMeasurement.fptc_value;
            
            if (pm10 is null or 0)
                return 0;

            if (pm10 > 150)
            {
                if (pm10 > 300)
                    return 4;

                return 3;
            }
            
            return 0;
        }
        
        private int GetSensorZoneSn(object model, int subType)
        {
            string targetTableName = "";
            string sensorSnColumn = "";
            string pkColumn = "";
            object pkValue = null;

            if (model is Soulbrain.Model.Facility.DustMeasurement dm)
            {
                targetTableName = Soulbrain.Model.Facility.DustMeasurement.TableName;
                sensorSnColumn = nameof(Soulbrain.Model.Facility.DustMeasurement.Fields.sensor_sn);
                pkColumn = nameof(Soulbrain.Model.Facility.DustMeasurement.Fields.dust_msrr_sn);
                pkValue = dm.dust_msrr_sn;
            }
            else if (model is Soulbrain.Model.Facility.WaterGather wg)
            {
                targetTableName = Soulbrain.Model.Facility.WaterGather.TableName;
                sensorSnColumn = nameof(Soulbrain.Model.Facility.WaterGather.Fields.sensor_sn);
                pkColumn = nameof(Soulbrain.Model.Facility.WaterGather.Fields.wgr_sn);
                pkValue = wg.wgr_sn;
            }
            else
            {
                return -1;
            }

            string strQuery = $@"SELECT {SensorZone.Fields.sensor_zone_sn}
                         FROM {SensorZone.TableName} 
                         WHERE {SensorZone.Fields.sensor_sub_ty_no} = {subType}
                         AND {SensorZone.Fields.sensor_sn} = (
                             SELECT {sensorSnColumn}
                             FROM {targetTableName}
                             WHERE {pkColumn} = {pkValue}
                         )";

            dynamic result = m_dataManager.GetSelect().SelectFirst(strQuery, out string strErrorMessage);

            if (result == null)
            {
                m_parent.Logger.Write($@"[Error] PlcDataManager.GetSensorZoneSn : {strErrorMessage}");
                return -1;
            }

            return result?.sensor_zone_sn;
        }

        private bool IsAlarmed(int sensorZoneSn)
        {
            string strQuery = $@"Select {Current.Fields.sensor_zone_sn} from {Current.TableName} where {Current.Fields.sensor_zone_sn} = {sensorZoneSn}";

            dynamic result = m_dataManager.GetSelect().SelectFirst(strQuery, out string strErrorMessage);

            if (result == null)
            {
                return false;
            }

            return result.sensor_zone_sn == sensorZoneSn;
        }
        
    }
}
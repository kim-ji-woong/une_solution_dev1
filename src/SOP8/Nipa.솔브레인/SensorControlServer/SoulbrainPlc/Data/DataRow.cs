using System;
using System.Collections.Generic;
using Soulbrain.Model.History;

namespace SoulbrainPlc.Data
{
    public class DataRow
    {
        private string m_strDate;
        private string m_strTime;
        private List<AirPollutionData> m_listAirPollutionData;
        private WaterGatherData m_waterGatherData;
        private DateTime m_dtTm;
        
        public string Date { get => m_strDate; set => m_strDate = value; }
        public string Time { get => m_strTime; set => m_strTime = value; }
        public List<AirPollutionData> AirPollutionDataList { get => m_listAirPollutionData; set => m_listAirPollutionData = value; }
        public WaterGatherData WaterGatherData { get => m_waterGatherData; set => m_waterGatherData = value; }
        public DateTime DateTime { get => m_dtTm; set => m_dtTm = value; }
        
        public DataRow()
        {
            AirPollutionDataList = new List<AirPollutionData>();
            WaterGatherData = new WaterGatherData();
        }

        public List<DustMeasurement> ConvertToDustMeasurement(DataRow dataRow)
        {
            if (m_listAirPollutionData == null) return null;
            
            List<DustMeasurement> dustMeasurements = new List<DustMeasurement>();

            foreach (AirPollutionData apd in m_listAirPollutionData)
            {
                DustMeasurement dm = new DustMeasurement();
                dm.dust_msrr_sn = apd.MsrrLocationSn;
                dm.fptc_value = apd.FptcValue;
                dm.ulfptc_value = apd.UlFptcValue;
                dm.co2_value = apd.Co2Value;
                dm.vlnms_value = apd.VlnmsValue;
                dm.exrfn_opr_yn = apd.ExrfnOprYn;
                dm.tm = dataRow.DateTime;
                dustMeasurements.Add(dm);
            }
            
            return dustMeasurements;
        }

        public WaterGather ConvertToWaterGather(DataRow dataRow)
        {
            if (m_waterGatherData == null) return null;
            
            WaterGather wg = new WaterGather();
            wg.wgr_sn = m_waterGatherData.WgrSn;
            wg.flugt_opn_rate = m_waterGatherData.FlugtOpnRate;
            wg.hydro_ion_dnsty_idex = m_waterGatherData.HydroIonDnsty;
            wg.tm = dataRow.DateTime;
            
            return wg;
        }
    }
    
    public class AirPollutionData
    {
        private int m_nMsrrLocationSn;
        private double m_dFptcValue;
        private double m_dUlFptcValue;
        private double m_dCo2Value;
        private double m_dVlnmsValue;
        private bool m_bExrfnOprYn;

        public int MsrrLocationSn
        {
            get => m_nMsrrLocationSn; 
            set => m_nMsrrLocationSn = value;
        }
        
        public double FptcValue
        {
            get => m_dFptcValue; 
            set => m_dFptcValue = value;
        }
        
        public double UlFptcValue
        {
            get => m_dUlFptcValue; 
            set => m_dUlFptcValue = value;
        }
        
        public double Co2Value
        {
            get => m_dCo2Value; 
            set => m_dCo2Value = value;
        }
        
        public double VlnmsValue
        {
            get => m_dVlnmsValue; 
            set => m_dVlnmsValue = value;
        }
        
        public bool ExrfnOprYn
        {
            get => m_bExrfnOprYn; 
            set => m_bExrfnOprYn = value;
        }
        
        public AirPollutionData()
        {
            
        }

        public AirPollutionData(int msrrLocationSn, double fptcValue, double ulFptcValue, double co2Value, double vlnmsValue, bool exrfnOprYn)
        {
            m_nMsrrLocationSn = msrrLocationSn;
            m_dFptcValue = fptcValue;
            m_dUlFptcValue = ulFptcValue;
            m_dCo2Value = co2Value;
            m_dVlnmsValue = vlnmsValue;
            m_bExrfnOprYn = exrfnOprYn;
        }
    }
    
    public class WaterGatherData
    {
        private int m_nWgrSn;
        private double m_dFlugtOpnRate;
        private double m_dHydroIonDnsty;
        
        public int WgrSn
        {
            get => m_nWgrSn; 
            set => m_nWgrSn = value;
        }
        
        public double FlugtOpnRate
        {
            get => m_dFlugtOpnRate; 
            set => m_dFlugtOpnRate = value;
        }
        
        public double HydroIonDnsty
        {
            get => m_dHydroIonDnsty; 
            set => m_dHydroIonDnsty = value;
        }
        
        public WaterGatherData()
        {
            
        }
        
        public WaterGatherData(int wgrSn, double flugtOpnRate, double hydroIonDnsty)
        {
            m_nWgrSn = wgrSn;
            m_dFlugtOpnRate = flugtOpnRate;
            m_dHydroIonDnsty = hydroIonDnsty;
        }
    }
}
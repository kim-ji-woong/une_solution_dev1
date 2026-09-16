using System;
using System.Collections.Generic;
using System.Linq;
using BusanSensorServer.Models.Sdms;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Base.Model.Sdms.Sensor;

namespace BusanSensorServer
{
    public class SensorManager
    {
        #region initialization

        private DataManager m_dataManager;
        private DataManager m_externalDataManager;
        
        public SensorManager(DataManager dataManager, DataManager externalDataManager)
        {
            m_dataManager = dataManager; // MsSql WSOP
            m_externalDataManager = externalDataManager; // Postgres tpdist
        }

        private List<AlarmSensor> m_alarmSensors = new List<AlarmSensor>();
        
        #endregion

        
        /*
         * Postgre tpdist에서 센서값을 가져와 SdmsSensorMaterial에 업데이트한다.
         * Table: dt_op_report
         */
        public bool EntireProcess(out string strErrorMessage)
        {
            Dictionary<int, bool> dicNodeUse = GetValidNodes(); // <nodeID, bool>

            // LimitData, RangeLimitData를 가져온다.
            
            if (dicNodeUse.Count == 0)
            {
                strErrorMessage = "sys_net_node_use가 1인 노드가 없습니다.";
                return false;
            }

            Dictionary<string, NodeSensorDTO> dicDtOpReport = GetNodeSensorDTOs(out strErrorMessage);
            
            if (dicDtOpReport.Count == 0)
            {
                strErrorMessage = "dt_op_report에 유효한 데이터가 없습니다.";
                return false;
            }

            foreach (var item in dicDtOpReport)
            {
                int nNodeNo = item.Value.NodeNo;
                int nReportMemAddr = item.Value.ReportMemAddr;
                double? fReportMemValue = item.Value.ReportMemValue;
                DateTime dtReportTimestamp = item.Value.ReportTimestamp;
                
                if (dicNodeUse.ContainsKey(nNodeNo))
                {
                    if (ProcessingSensorZone(nNodeNo, nReportMemAddr, fReportMemValue, dtReportTimestamp, out strErrorMessage) == false)
                    {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        public bool ProcessingSensorZone(int nNodeID, int nUniqueNo, double? dValue, DateTime dtReportTimestamp, out string strErrorMessage)
        {
            strErrorMessage = "";
            
            MaterialSensor materialSensor = new MaterialSensor();

            string strSQL = $@"SUBSTRING(SdmsSensorZone.UniqueKey, LEN(SdmsSensorZone.UniqueKey) - CHARINDEX('_', REVERSE(SdmsSensorZone.UniqueKey)) + 2, LEN(SdmsSensorZone.UniqueKey)) = '{nUniqueNo}'
                            and 
                            SUBSTRING(SdmsSensorZone.UniqueKey, 1, CHARINDEX('_', SdmsSensorZone.UniqueKey) - 1) = '{nNodeID}'";
            
            IEnumerable<SensorZone> dynamics = m_dataManager.GetSelect().Select<SensorZone>(strSQL, out strErrorMessage);
            
            if (dynamics == null)
            {
                strErrorMessage = "SdmsSensorZone에서 UniqueKey와 NodeID로 조회된 데이터가 없습니다.";
                return false;
            }

            foreach (SensorZone item in dynamics)
            {
                Console.Write(dynamics.Count().ToString());
                // item.SensorZoneNo로 SensorMaterial의 Value 업데이트
                if (UpdateSensorMaterial(item, dValue, dtReportTimestamp, out strErrorMessage) == false)
                {
                    return false;
                }
                else
                {
                    // 업데이트 완료시 item.SensorZoneNo로 LimitData 조회 후 알람처리
                    
                }
            }
            
            
            return true;
        }

        public bool UpdateSensorMaterial(SensorZone sz, double? dValue, DateTime timeStamp, out string strErrorMessage)
        {
            string strValue = null;
            if (dValue == null)
            {
                strErrorMessage = "dValue is null, SensorZone : " + sz.SensorZoneNo.ToString() + "_" + sz.UniqueKey;
                return true;
            }
            
            strValue = dValue.Value.ToString("F4");
            
            string strSQL = $@"Update SdmsSensorMaterial set CurrentData = {strValue} Where SensorZoneNo = {sz.SensorZoneNo}";
            
            return m_dataManager.GetUpdate().Update(strSQL, out strErrorMessage);
        }

        public Dictionary<int, bool> GetValidNodes()
        {
            string strSQL = "Select snn.sys_net_node_id from sys_net_node snn where snn.sys_net_node_use = 1";

            Dictionary<int, bool> dicNode = new Dictionary<int, bool>();
            
            IEnumerable<dynamic> dynamics = m_externalDataManager.GetSelect().Select(strSQL, out string strErrorMessage);
            foreach (var item in dynamics)
            {
                dicNode[item.sys_net_node_id] = true;  
            }
            
            return dicNode;
        }

        /*
         * Select dt_op_report
         */
        public Dictionary<string, NodeSensorDTO> GetNodeSensorDTOs(out string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;
            
            // 새벽 1시전에는 전날 데이터도 유효하게 취급한다
            if (dtNow.Hour == 0)
                dtNow = dtNow.AddDays(-1);

            string strDate = string.Format("{0}-{1:00}-{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

            // timeStamp관계 없이 데이터 가져오기 Test용
            string strSQL = $@"
                                Select dt_op_report_id, sys_net_node_id, report_mem_addr, report_mem_value, report_mem_extra, report_valid_cnt, report_timestamp
                                    from dt_op_report where dt_op_report_id in (
	                                    select max(dt_op_report_id) from dt_op_report group by sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id, report_mem_addr
                                    ) 
                                    --and report_timestamp > '{strDate}'
                                    order by sys_net_service_id, sys_net_region_id, sys_net_group_id, sys_net_node_id, report_mem_addr
                            ";
            
            IEnumerable<dynamic> dynamics = m_externalDataManager.GetSelect().Select(strSQL, out strErrorMessage);

            Dictionary<string, NodeSensorDTO> dicNode = new Dictionary<string, NodeSensorDTO>();

            foreach (var item in dynamics)
            {
                
                NodeSensorDTO ns = new NodeSensorDTO();
                ns.DtOpReportID = item.dt_op_report_id;
                ns.NodeNo = item.sys_net_node_id;
                ns.ReportMemAddr = item.report_mem_addr;
                ns.ReportMemValue = item.report_mem_value;
                ns.ReportMemExtra = item.report_mem_extra;
                ns.ReportValidCnt = item.report_valid_cnt;
                ns.ReportTimestamp = item.report_timestamp;

                string strKey = $"{item.sys_net_node_id}_{item.report_mem_addr}";
                
                dicNode[strKey] = ns;
            }
            
            return dicNode;
        }

        public class NodeSensorDTO
        {
            private int m_nDtOpReportID;
            private int m_nNodeNo;
            private int m_nReportMemAddr;
            private double? m_fReport_mem_value;
            private double? m_nReport_mem_extra;
            private int? m_nReport_valid_cnt;
            private DateTime m_strReport_timestamp;

            public int DtOpReportID
            {
                get { return m_nDtOpReportID; }
                set { m_nDtOpReportID = value; }
            }
            
            public int NodeNo
            {
                get { return m_nNodeNo; }
                set { m_nNodeNo = value; }
            }
            
            public int ReportMemAddr
            {
                get { return m_nReportMemAddr; }
                set { m_nReportMemAddr = value; }
            }
            
            public double? ReportMemValue
            {
                get { return m_fReport_mem_value; }
                set { m_fReport_mem_value = value; }
            }
            
            public double? ReportMemExtra
            {
                get { return m_nReport_mem_extra; }
                set { m_nReport_mem_extra = value; }
            }
            
            public int? ReportValidCnt
            {
                get { return m_nReport_valid_cnt; }
                set { m_nReport_valid_cnt = value; }
            }
            
            public DateTime ReportTimestamp
            {
                get { return m_strReport_timestamp; }
                set { m_strReport_timestamp = value; }
            }
            
            
        }

        
        public class AlarmSensor
        {
            private int m_nSensorZoneNo;
            private int m_nTagNo;
            private int m_nAlarmLevel;
            
            public int SensorZoneNo
            {
                get { return m_nSensorZoneNo; }
                set { m_nSensorZoneNo = value; }
            }
            
            public int TagNo
            {
                get { return m_nTagNo; }
                set { m_nTagNo = value; }
            }
            
            public int AlarmLevel
            {
                get { return m_nAlarmLevel; }
                set { m_nAlarmLevel = value; }
            }
        }
    }
}
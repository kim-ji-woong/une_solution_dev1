using Base.Model.Common;
using Base.Model.Spatial;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;
using Kftc.BLL.Request;
using Kftc.BLL.Response;
using Kftc.Model.Facility;
using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using Response;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Kftc.BLL.Process
{
    class EquipmentManager
    {
        private IDataManager m_dataManager = null;

        private const string EXCEL_TITLE = "장비 리스트";

        private const string Column_No = "No";
        private const string Column_EquipmentType = "장비 타입";
        private const string Column_EquipmentName = "자재명";
        private const string Column_Model = "모델명";
        private const string Column_Standard = "규격";
        private const string Column_IP = "IP";
        private const string Column_Location = "위치";
        private const string Column_ExChangeTime = "교체일자";
        private const string Column_Memo = "비고";

        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();
        private int m_nColumnCount = 9;

        public const int TitleFontSize = 20;
        public const int NormalFontSize = 11;
        public const int RowHeight = 22;

        public EquipmentManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseEquipmentList GetEquipmentList(string strSearchText)
        {
            ResponseEquipmentList response = new ResponseEquipmentList();

            try
            {
                List<EquipmentInfo> equipmentInfos = GetEquipmentDatas(strSearchText, out string strErrMsg);
                if (equipmentInfos == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.EquipmentList = equipmentInfos;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
                response.EquipmentList = null;
            }

            return response;
        }

        public List<EquipmentInfo> GetEquipmentDatas(string strSearchText, out string strErrMsg)
        {
            List<EquipmentInfo> equipments = null;
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT {Equipment.TableName}.{Equipment.Fields.eqpmn_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_no}, {Equipment.TableName}.{Equipment.Fields.eqpmn_name}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_idntfr}, {Equipment.TableName}.{Equipment.Fields.model_name}, {Equipment.TableName}.{Equipment.Fields.makr_name}, {Equipment.TableName}.{Equipment.Fields.stndrd}, 
                                                {Equipment.TableName}.{Equipment.Fields.ip}, {Equipment.TableName}.{Equipment.Fields.lc}, {Equipment.TableName}.{Equipment.Fields.exchng_tm}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr} AS ParentName,
                                                {Zone.TableName}.{Zone.Fields.name} AS ZoneName
                                                FROM {Equipment.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {Equipment.TableName}.{Equipment.Fields.eqpmn_no}
                                                LEFT JOIN {EquipmentParent.TableName} ON {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn} = {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}
                                                LEFT JOIN {EquipmentZone.TableName} ON {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {EquipmentZoneLinkedZone.TableName} ON {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.zone_sn}");
                                                
                if (strSearchText?.Length > 0)
                {
                    strSQL += $" WHERE {Codes.Fields.code_name} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_name} LIKE '%{strSearchText}%'" +
                        $" OR {Zone.TableName}.{Zone.Fields.name} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.eqpmn_idntfr} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.eqpmn_name} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.model_name} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.makr_name} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.stndrd} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.ip} LIKE '%{strSearchText}%'" +
                        $" OR {Equipment.TableName}.{Equipment.Fields.lc} LIKE '%{strSearchText}%'";
                }

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                equipments = new List<EquipmentInfo>();

                foreach (var result in results)
                {
                    EquipmentInfo equipment = new EquipmentInfo();
                    equipment.ParentNo = result.eqpmn_parnts_sn;
                    equipment.ParentName = result.ParentName;
                    equipment.EquipmentNo = result.eqpmn_sn;
                    equipment.EquipmentIdenti = result.eqpmn_idntfr;
                    equipment.EquipmentName = result.eqpmn_name;
                    equipment.ModelName = result.model_name;
                    equipment.MakerName = result.makr_name;
                    equipment.Standard = result.stndrd;
                    equipment.IP = result.ip;
                    equipment.Location = result.lc;
                    equipment.ExchangeTime = result.exchng_tm;
                    equipment.TypeNo = result.eqpmn_no;
                    equipment.TypeName = result.code_name;
                    equipment.Memo = result.eqpmn_memo;
                    equipment.ZoneName = result.ZoneName;

                    equipments.Add(equipment);
                }
            }
            catch (Exception e)
            {
                equipments = null;
                strErrMsg = e.Message;
            }

            return equipments;
        }

        public List<EquipmentInfo> GetEquipmentDatas(int nParentNo, out string strErrMsg)
        {
            List<EquipmentInfo> equipments = null;
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT {Equipment.TableName}.{Equipment.Fields.eqpmn_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_no}, {Equipment.TableName}.{Equipment.Fields.eqpmn_name}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_idntfr}, {Equipment.TableName}.{Equipment.Fields.model_name}, {Equipment.TableName}.{Equipment.Fields.makr_name}, {Equipment.TableName}.{Equipment.Fields.stndrd}, 
                                                {Equipment.TableName}.{Equipment.Fields.ip}, {Equipment.TableName}.{Equipment.Fields.lc}, {Equipment.TableName}.{Equipment.Fields.exchng_tm}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr} AS ParentName,
                                                {Zone.TableName}.{Zone.Fields.name} AS ZoneName
                                                FROM {Equipment.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {Equipment.TableName}.{Equipment.Fields.eqpmn_no}
                                                LEFT JOIN {EquipmentParent.TableName} ON {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn} = {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}
                                                LEFT JOIN {EquipmentZone.TableName} ON {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {EquipmentZoneLinkedZone.TableName} ON {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.zone_sn}");

                strSQL += $" WHERE {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn} = {nParentNo}";

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                equipments = new List<EquipmentInfo>();

                foreach (var result in results)
                {
                    EquipmentInfo equipment = new EquipmentInfo();
                    equipment.ParentNo = result.eqpmn_parnts_sn;
                    equipment.ParentName = result.ParentName;
                    equipment.EquipmentNo = result.eqpmn_sn;
                    equipment.EquipmentIdenti = result.eqpmn_idntfr;
                    equipment.EquipmentName = result.eqpmn_name;
                    equipment.ModelName = result.model_name;
                    equipment.MakerName = result.makr_name;
                    equipment.Standard = result.stndrd;
                    equipment.IP = result.ip;
                    equipment.Location = result.lc;
                    equipment.ExchangeTime = result.exchng_tm;
                    equipment.TypeNo = result.eqpmn_no;
                    equipment.TypeName = result.code_name;
                    equipment.Memo = result.eqpmn_memo;
                    equipment.ZoneName = result.ZoneName;

                    equipments.Add(equipment);
                }
            }
            catch (Exception e)
            {
                equipments = null;
                strErrMsg = e.Message;
            }

            return equipments;
        }

        public ResponseEquipmentType GetEquipmentType()
        {
            ResponseEquipmentType response = new ResponseEquipmentType();

            try
            {
                string strConditions = $"{Codes.Fields.cl_code} = {(int)dnsDataKftc.CommonCode.CodeType.EquipmentType}";

                IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strConditions, out string strErrMsg);
                if (codes == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.EquipmentTypes = new List<EquipmentTypeData>();

                foreach (Codes code in codes)
                {
                    EquipmentTypeData equipmentType = new EquipmentTypeData();
                    equipmentType.EquipmentTypNo = code.code;
                    equipmentType.EquipmentTypName = code.code_name;

                    response.EquipmentTypes.Add(equipmentType);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.EquipmentTypes = null;
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseParentList GetParentList()
        {
            ResponseParentList response = new ResponseParentList();

            try
            {
                string strSQL = string.Format(@$"SELECT {EquipmentParent.Fields.eqpmn_parnts_sn}, {EquipmentParent.Fields.eqpmn_idntfr}, 
                                                {Zone.TableName}.{Zone.Fields.name} AS ZoneName
                                                FROM {EquipmentParent.TableName} 
                                                LEFT JOIN {EquipmentZone.TableName} ON {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {EquipmentZoneLinkedZone.TableName} ON {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.zone_sn}
                                                ");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.ParentList = new List<ParentListData>();

                foreach (var result in results)
                {
                    ParentListData parent = new ParentListData();
                    parent.ParentNo = result.eqpmn_parnts_sn;
                    parent.ParentName = result.eqpmn_idntfr;
                    parent.ZoneName = result.ZoneName;

                    response.ParentList.Add(parent);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.ParentList = null;
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseEquipment InsertEquipment(EquipmentInsert equipmentData)
        {
            ResponseEquipment response = new ResponseEquipment();

            IDataManager dataManager = m_dataManager.Clone();
            if (dataManager.BeginBatch(out string strErrMsg) == false)
            {
                response.Success = false;
                response.Message = strErrMsg;
                response.Equipment = null;
            }
            else
            {
                try
                {
                    Equipment equipment = new Equipment();
                    equipment.eqpmn_parnts_sn = equipmentData.ParentNo;
                    equipment.eqpmn_no = equipmentData.TypeNo;
                    equipment.eqpmn_idntfr = equipmentData.EquipmentIdenti;
                    equipment.eqpmn_name = equipmentData.EquipmentName;
                    equipment.model_name = equipmentData.ModelName;
                    equipment.makr_name = equipmentData.MakerName;
                    equipment.stndrd = equipmentData.Standard;
                    equipment.ip = equipmentData.IP;
                    equipment.lc = equipmentData.Location;
                    equipment.exchng_tm = equipmentData.ExchangeTime;
                    equipment.eqpmn_memo = equipmentData.Memo;

                    if (dataManager.GetCreate().Insert<Equipment>(equipment, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    string strConditions = $"{Equipment.Fields.eqpmn_parnts_sn} {(equipment.eqpmn_parnts_sn == null ? "IS NULL " : "= " + equipment.eqpmn_parnts_sn + "")} AND {Equipment.Fields.eqpmn_no} = {equipment.eqpmn_no} AND {Equipment.Fields.eqpmn_idntfr} = '{equipment.eqpmn_idntfr}' AND {Equipment.Fields.eqpmn_name} {(equipment.eqpmn_name == null ? "is NULL" : "= '" + equipment.eqpmn_name + "'")} " +
                        $"AND {Equipment.Fields.model_name} {(equipment.model_name == null ? "is NULL" : "= '" + equipment.model_name + "'")} AND {Equipment.Fields.makr_name} {(equipment.makr_name == null ? "IS NULL " : "= '" + equipment.makr_name + "'")} AND {Equipment.Fields.stndrd} {(equipment.stndrd == null ? "IS NULL " : "= '" + equipment.stndrd + "'")} " +
                        $"AND {Equipment.Fields.ip} {(equipment.ip == null ? "IS NULL " : "= '" + equipment.ip + "'")} AND {Equipment.Fields.lc} {(equipment.lc == null ? "IS NULL" : "= '" + equipment.lc + "'")} AND {Equipment.Fields.exchng_tm} {(equipment.exchng_tm.HasValue ? "= '" + equipment.exchng_tm.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "IS NULL")} " +
                        $"AND {Equipment.Fields.eqpmn_memo} {(equipment.eqpmn_memo == null ? "IS NULL" : "= '" + equipment.eqpmn_memo + "'")} " +
                        $"ORDER BY {Equipment.Fields.eqpmn_sn} DESC";

                    Equipment _equipment = dataManager.GetSelect().SelectFirst<Equipment>(strConditions, out strErrMsg);
                    if (_equipment == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    EquipmentInfo equipmentInfo = new EquipmentInfo();
                    equipmentInfo.EquipmentNo = _equipment.eqpmn_sn;
                    equipmentInfo.TypeNo = equipmentData.TypeNo;
                    equipmentInfo.TypeName = equipmentData.TypeName;
                    equipmentInfo.ParentNo = equipmentData.ParentNo;
                    equipmentInfo.ParentName = equipmentData.ParentName;
                    equipmentInfo.EquipmentIdenti = equipmentData.EquipmentIdenti;
                    equipmentInfo.EquipmentName = equipmentData.EquipmentName;
                    equipmentInfo.ModelName = equipmentData.ModelName;
                    equipmentInfo.MakerName = equipmentData.MakerName;
                    equipmentInfo.Standard = equipmentData.Standard;
                    equipmentInfo.IP = equipmentData.IP;
                    equipmentInfo.Location = equipmentData.Location;
                    equipmentInfo.ZoneName = equipmentData.ZoneName;
                    equipmentInfo.ExchangeTime = equipmentData.ExchangeTime;
                    equipmentInfo.Memo = equipmentData.Memo;

                    if (dataManager.BatchCommit(out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    response.Equipment = equipmentInfo;
                    response.Success = true;
                }
                catch (Exception e)
                {                    
                    response.Message = e.Message;
                    
                    if (dataManager.BatchRollback(out strErrMsg) == false)
                    {
                        response.Message = strErrMsg;
                    }

                    response.Success = false;
                    response.Equipment = null;
                }
            }

            return response;
        }

        public ResponseEquipment UpdateEquipment(EquipmentInfo equipmentData)
        {
            ResponseEquipment response = new ResponseEquipment();

            try
            {
                Equipment equipment = new Equipment();
                equipment.eqpmn_sn = equipmentData.EquipmentNo;
                equipment.eqpmn_parnts_sn = equipmentData.ParentNo;
                equipment.eqpmn_no = equipmentData.TypeNo;
                equipment.eqpmn_idntfr = equipmentData.EquipmentIdenti;
                equipment.eqpmn_name = equipmentData.EquipmentName;
                equipment.model_name = equipmentData.ModelName;
                equipment.makr_name = equipmentData.MakerName;
                equipment.stndrd = equipmentData.Standard;
                equipment.ip = equipmentData.IP;
                equipment.lc = equipmentData.Location;
                equipment.exchng_tm = equipmentData.ExchangeTime;
                equipment.eqpmn_memo = equipmentData.Memo;

                string strAdditionalConditions = $"{Equipment.Fields.eqpmn_sn} = {equipmentData.EquipmentNo}";

                if (m_dataManager.GetUpdate().Update<Equipment>(equipment, strAdditionalConditions, out string strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }


                // 변경된 층 정보까지 
                string strSQL = string.Format(@$"SELECT {Equipment.TableName}.{Equipment.Fields.eqpmn_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}, {Equipment.TableName}.{Equipment.Fields.eqpmn_no}, {Equipment.TableName}.{Equipment.Fields.eqpmn_name}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_idntfr}, {Equipment.TableName}.{Equipment.Fields.model_name}, {Equipment.TableName}.{Equipment.Fields.makr_name}, {Equipment.TableName}.{Equipment.Fields.stndrd}, 
                                                {Equipment.TableName}.{Equipment.Fields.ip}, {Equipment.TableName}.{Equipment.Fields.lc}, {Equipment.TableName}.{Equipment.Fields.exchng_tm}, 
                                                {Equipment.TableName}.{Equipment.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr} AS ParentName,
                                                {Zone.TableName}.{Zone.Fields.name} AS ZoneName
                                                FROM {Equipment.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {Equipment.TableName}.{Equipment.Fields.eqpmn_no}
                                                LEFT JOIN {EquipmentParent.TableName} ON {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn} = {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn}
                                                LEFT JOIN {EquipmentZone.TableName} ON {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {EquipmentZoneLinkedZone.TableName} ON {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.eqp_zone_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}
                                                LEFT JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.zone_sn}");

                strSQL += $" WHERE {Equipment.TableName}.{Equipment.Fields.eqpmn_sn} = {equipmentData.EquipmentNo}";

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                if (result == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                equipmentData.ZoneName = result.ZoneName;

                response.Equipment = equipmentData;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }

        public MessageResult DeleteEquipment(List<EquipmentInfo> equipments)
        {
            MessageResult response = new MessageResult();

            try
            {
                string strConditions = null;

                if (equipments.Count == 0)
                {
                    throw new ApplicationException("삭제할 정보가 없습니다.");
                }

                foreach (EquipmentInfo equipment in equipments)
                {
                    if (strConditions == null)
                        strConditions = equipment.EquipmentNo.ToString();
                    else
                        strConditions += ", " + equipment.EquipmentNo.ToString();
                }

                strConditions = $"{Equipment.Fields.eqpmn_sn} in ({strConditions})";

                if (m_dataManager.GetDelete().Delete<Equipment>(strConditions, out string strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }

        public ResponseParentEquipList GetParentEquipmentList(string strSearchText)
        {
            ResponseParentEquipList response = new ResponseParentEquipList();

            try
            {
                List<ParentEquipInfo> equipmentInfos = GetParentEquipmentDatas(strSearchText, out string strErrMsg);
                if (equipmentInfos == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.EquipmentList = equipmentInfos;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
                response.EquipmentList = null;
            }

            return response;
        }


        public List<ParentEquipInfo> GetParentEquipmentDatas(string strSearchText, out string strErrMsg)
        {
            List<ParentEquipInfo> equipments = null;
            strErrMsg = null;

            try
            {
                // TPS 조회
                List<TpsData> tpsDatas = GetTpsListData(out strErrMsg);
                if (tpsDatas == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<int, string> dicTps = new Dictionary<int, string>();

                foreach (TpsData data in tpsDatas)
                {
                    dicTps[data.TpsNo] = data.TpsName;
                }
                
                string strSQL = string.Format(@$"SELECT {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.model_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.makr_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.stndrd}, {EquipmentParent.TableName}.{EquipmentParent.Fields.ip}, {EquipmentParent.TableName}.{EquipmentParent.Fields.lc}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.exchng_tm}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                (SELECT COUNT({Equipment.Fields.eqpmn_sn}) FROM {Equipment.TableName} WHERE {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}) AS ChildCount
                                                FROM {EquipmentParent.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}");

                if (strSearchText?.Length > 0)
                {
                    strSQL += $" WHERE {Codes.Fields.code_name} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_name} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.model_name} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.makr_name} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.stndrd} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.ip} LIKE '%{strSearchText}%'" +
                        $" OR {EquipmentParent.TableName}.{EquipmentParent.Fields.lc} LIKE '%{strSearchText}%'";
                }

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                equipments = new List<ParentEquipInfo>();

                foreach (var result in results)
                {
                    ParentEquipInfo equipment = new ParentEquipInfo();
                    equipment.EquipmentNo = result.eqpmn_parnts_sn;
                    equipment.EquipmentIdenti = result.eqpmn_idntfr;
                    equipment.EquipmentName = result.eqpmn_name;

                    string strTpsName = null;

                    if (result.eqp_zone_sn != null && dicTps.ContainsKey(result.eqp_zone_sn))
                    {
                        strTpsName = dicTps[result.eqp_zone_sn];
                    }

                    equipment.TpsNo = result.eqp_zone_sn;
                    equipment.TpsName = strTpsName;
                    equipment.ChildCount = result.ChildCount;
                    
                    equipment.ModelName = result.model_name;
                    equipment.MakerName = result.makr_name;
                    equipment.Standard = result.stndrd;
                    equipment.IP = result.ip;
                    equipment.Location = result.lc;
                    equipment.ExchangeTime = result.exchng_tm;
                    equipment.TypeNo = result.eqpmn_no;
                    equipment.TypeName = result.code_name;
                    equipment.Memo = result.eqpmn_memo;


                    equipments.Add(equipment);
                }
            }
            catch (Exception e)
            {
                equipments = null;
                strErrMsg = e.Message;
            }

            return equipments;
        }

        public List<ParentEquipInfo> GetTpsParentEquipmentDatas(int nTpsNo, out string strErrMsg)
        {
            List<ParentEquipInfo> equipments = null;
            strErrMsg = null;

            try
            {
                // TPS 조회
                List<TpsData> tpsDatas = GetTpsListData(out strErrMsg);
                if (tpsDatas == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<int, string> dicTps = new Dictionary<int, string>();

                foreach (TpsData data in tpsDatas)
                {
                    dicTps[data.TpsNo] = data.TpsName;
                }

                string strSQL = string.Format(@$"SELECT {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.model_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.makr_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.stndrd}, {EquipmentParent.TableName}.{EquipmentParent.Fields.ip}, {EquipmentParent.TableName}.{EquipmentParent.Fields.lc}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.exchng_tm}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                (SELECT COUNT({Equipment.Fields.eqpmn_sn}) FROM {Equipment.TableName} WHERE {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}) AS ChildCount
                                                FROM {EquipmentParent.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}");

                strSQL += $" WHERE {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn} = {nTpsNo}";

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                equipments = new List<ParentEquipInfo>();

                foreach (var result in results)
                {
                    ParentEquipInfo equipment = new ParentEquipInfo();
                    equipment.EquipmentNo = result.eqpmn_parnts_sn;
                    equipment.EquipmentIdenti = result.eqpmn_idntfr;
                    equipment.EquipmentName = result.eqpmn_name;

                    string strTpsName = null;

                    if (result.eqp_zone_sn != null && dicTps.ContainsKey(result.eqp_zone_sn))
                    {
                        strTpsName = dicTps[result.eqp_zone_sn];
                    }

                    equipment.TpsNo = result.eqp_zone_sn;
                    equipment.TpsName = strTpsName;
                    equipment.ChildCount = result.ChildCount;

                    equipment.ModelName = result.model_name;
                    equipment.MakerName = result.makr_name;
                    equipment.Standard = result.stndrd;
                    equipment.IP = result.ip;
                    equipment.Location = result.lc;
                    equipment.ExchangeTime = result.exchng_tm;
                    equipment.TypeNo = result.eqpmn_no;
                    equipment.TypeName = result.code_name;
                    equipment.Memo = result.eqpmn_memo;


                    equipments.Add(equipment);
                }
            }
            catch (Exception e)
            {
                equipments = null;
                strErrMsg = e.Message;
            }

            return equipments;
        }       

        public List<TpsData> GetTpsListData(out string strErrMsg)
        {
            List<TpsData> tpsDatas = null;
            strErrMsg = null;

            try
            {
                // TPS 조회
                string strSQL = string.Format(@$"SELECT {EquipmentParentZone.TableName}.{EquipmentParentZone.Fields.zone_sn}, {EquipmentParentZone.TableName}.{EquipmentParentZone.Fields.eqp_zone_sn},
                                                {Zone.TableName}.{Zone.Fields.name} as ZoneName, {EquipmentZone.TableName}.{EquipmentZone.Fields.name} as EqName
                                                FROM {EquipmentParentZone.TableName} 
                                                INNER JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentParentZone.TableName}.{EquipmentParentZone.Fields.zone_sn}
                                                INNER JOIN {EquipmentZone.TableName} ON {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {EquipmentParentZone.TableName}.{EquipmentParentZone.Fields.eqp_zone_sn}");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                tpsDatas = new List<TpsData>();

                foreach (var result in results)
                {
                    TpsData data = new TpsData();
                    data.TpsNo = result.eqp_zone_sn;
                    data.TpsName = $"{result.ZoneName} {result.EqName}";

                    tpsDatas.Add(data);
                }
            }
            catch (Exception e)
            {
                tpsDatas = null;
                strErrMsg = e.Message;
            }

            return tpsDatas;
        }

        public ResponseTpsList GetTpsList()
        {
            ResponseTpsList response = new ResponseTpsList();

            try
            {
                List<TpsData> tpsDatas = GetTpsListData(out string strErrMsg);
                if (tpsDatas == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.TpsList = tpsDatas;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
                response.TpsList = null;
            }

            return response;
        }

        public ResponseParentEquipment InsertParentEquipment(ParentEquipInsert equipmentData)
        {
            ResponseParentEquipment response = new ResponseParentEquipment();

            IDataManager dataManager = m_dataManager.Clone();
            if (dataManager.BeginBatch(out string strErrMsg) == false)
            {
                response.Success = false;
                response.Message = strErrMsg;
                response.Equipment = null;
            }
            else
            {
                try
                {
                    EquipmentParent equipment = new EquipmentParent();
                    equipment.eqp_zone_sn = equipmentData.TpsNo;
                    equipment.eqpmn_no = equipmentData.TypeNo;
                    equipment.eqpmn_idntfr = equipmentData.EquipmentIdenti;
                    equipment.eqpmn_name = equipmentData.EquipmentName;
                    equipment.model_name = equipmentData.ModelName;
                    equipment.makr_name = equipmentData.MakerName;
                    equipment.stndrd = equipmentData.Standard;
                    equipment.ip = equipmentData.IP;
                    equipment.lc = equipmentData.Location;
                    equipment.exchng_tm = equipmentData.ExchangeTime;
                    equipment.eqpmn_memo = equipmentData.Memo;

                    if (dataManager.GetCreate().Insert<EquipmentParent>(equipment, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    string strConditions = $"{EquipmentParent.Fields.eqp_zone_sn} {(equipment.eqp_zone_sn == null ? "is NULL" : "= " + equipment.eqp_zone_sn + "")} AND {EquipmentParent.Fields.eqpmn_no} = {equipment.eqpmn_no} AND {EquipmentParent.Fields.eqpmn_idntfr} = '{equipment.eqpmn_idntfr}' AND {EquipmentParent.Fields.eqpmn_name} {(equipment.eqpmn_name == null ? "is NULL" : "= '" + equipment.eqpmn_name + "'")} " +
                        $"AND {EquipmentParent.Fields.model_name} {(equipment.model_name == null ? "is NULL" : "= '" + equipment.model_name + "'")} AND {EquipmentParent.Fields.makr_name} {(equipment.makr_name == null ? "IS NULL " : "= '" + equipment.makr_name + "'")} AND {EquipmentParent.Fields.stndrd} {(equipment.stndrd == null ? "IS NULL " : "= '" + equipment.stndrd + "'")} " +
                        $"AND {EquipmentParent.Fields.ip} {(equipment.ip == null ? "IS NULL " : "= '" + equipment.ip + "'")} AND {EquipmentParent.Fields.lc} {(equipment.lc == null ? "IS NULL" : "= '" + equipment.lc + "'")} AND {EquipmentParent.Fields.exchng_tm} {(equipment.exchng_tm.HasValue ? "= '" + equipment.exchng_tm.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "IS NULL")} " +
                        $"AND {EquipmentParent.Fields.eqpmn_memo} {(equipment.eqpmn_memo == null ? "IS NULL" : "= '" + equipment.eqpmn_memo + "'")} " +
                        $"ORDER BY {EquipmentParent.Fields.eqpmn_parnts_sn} DESC";

                    EquipmentParent _equipment = dataManager.GetSelect().SelectFirst<EquipmentParent>(strConditions, out strErrMsg);
                    if (_equipment == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    ParentEquipInfo equipmentInfo = new ParentEquipInfo();
                    equipmentInfo.EquipmentNo = _equipment.eqpmn_parnts_sn;
                    equipmentInfo.TypeNo = equipmentData.TypeNo;
                    equipmentInfo.TypeName = equipmentData.TypeName;

                    equipmentInfo.TpsNo = equipmentData.TpsNo;
                    equipmentInfo.TpsName = equipmentData.TpsName;

                    equipmentInfo.EquipmentIdenti = equipmentData.EquipmentIdenti;
                    equipmentInfo.EquipmentName = equipmentData.EquipmentName;
                    equipmentInfo.ModelName = equipmentData.ModelName;
                    equipmentInfo.MakerName = equipmentData.MakerName;
                    equipmentInfo.Standard = equipmentData.Standard;
                    equipmentInfo.IP = equipmentData.IP;
                    equipmentInfo.Location = equipmentData.Location;

                    equipmentInfo.ExchangeTime = equipmentData.ExchangeTime;
                    equipmentInfo.Memo = equipmentData.Memo;

                    equipmentInfo.ChildCount = 0;

                    if (dataManager.BatchCommit(out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    response.Equipment = equipmentInfo;
                    response.Success = true;
                }
                catch (Exception e)
                {
                    response.Message = e.Message;

                    if (dataManager.BatchRollback(out strErrMsg) == false)
                    {
                        response.Message = strErrMsg;
                    }

                    response.Success = false;
                    response.Equipment = null;
                }
            }

            return response;
        }

        public MessageResult UpdateParentEquipment(ParentEquipInfo equipmentData)
        {
            MessageResult response = new MessageResult();

            try
            {
                EquipmentParent equipment = new EquipmentParent();
                equipment.eqpmn_parnts_sn = equipmentData.EquipmentNo;
                equipment.eqpmn_no = equipmentData.TypeNo;
                equipment.eqp_zone_sn = equipmentData.TpsNo;
                equipment.eqpmn_idntfr = equipmentData.EquipmentIdenti;
                equipment.eqpmn_name = equipmentData.EquipmentName;
                equipment.model_name = equipmentData.ModelName;
                equipment.makr_name = equipmentData.MakerName;
                equipment.stndrd = equipmentData.Standard;
                equipment.ip = equipmentData.IP;
                equipment.lc = equipmentData.Location;
                equipment.exchng_tm = equipmentData.ExchangeTime;
                equipment.eqpmn_memo = equipmentData.Memo;

                string strAdditionalConditions = $"{EquipmentParent.Fields.eqpmn_parnts_sn} = {equipmentData.EquipmentNo}";

                if (m_dataManager.GetUpdate().Update<EquipmentParent>(equipment, strAdditionalConditions, out string strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }

        public MessageResult DeleteParentEquipment(List<ParentEquipInfo> equipments)
        {
            MessageResult response = new MessageResult();

            try
            {
                string strConditions = null;

                if (equipments.Count == 0)
                {
                    throw new ApplicationException("삭제할 정보가 없습니다.");
                }

                foreach (ParentEquipInfo equipment in equipments)
                {
                    if (strConditions == null)
                        strConditions = equipment.EquipmentNo.ToString();
                    else
                        strConditions += ", " + equipment.EquipmentNo.ToString();
                }

                // 맞물려 있는 하위 장비 업데이트
                if (strConditions != null)
                {
                    string strSQL = $"UPDATE {Equipment.TableName} SET {Equipment.Fields.eqpmn_parnts_sn} = NULL WHERE {Equipment.Fields.eqpmn_parnts_sn} in ({strConditions})";                    

                    if (m_dataManager.GetUpdate().Update(strSQL, out string strErrMsg2) == false)
                    {
                        throw new ApplicationException(strErrMsg2);
                    }                    
                }

                strConditions = $"{EquipmentParent.Fields.eqpmn_parnts_sn} in ({strConditions})";
                if (m_dataManager.GetDelete().Delete<EquipmentParent>(strConditions, out string strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }

        // TPS실 상위 장비 매칭 정보
        public ResponseParentEquipList GetTpsParentEquipments(int nTpsNo)
        {
            ResponseParentEquipList response = new ResponseParentEquipList();

            try
            {
                string strConditions = $"{EquipmentZone.Fields.eqp_zone_sn} = {nTpsNo}";

                // TPS 조회
                string strSQL = string.Format(@$"SELECT {EquipmentZone.TableName}.{EquipmentZone.Fields.name} as EqName, {Zone.TableName}.{Zone.Fields.name} as ZoneName 
                                                FROM {EquipmentZone.TableName} 
                                                INNER JOIN {EquipmentZoneLinkedZone.TableName} ON {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.eqp_zone_sn} = {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn}
                                                INNER JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {EquipmentZoneLinkedZone.TableName}.{EquipmentZoneLinkedZone.Fields.zone_sn}
                                                WHERE {EquipmentZone.TableName}.{EquipmentZone.Fields.eqp_zone_sn} = {nTpsNo}");

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out string strErrMsg);
                if (result == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                string strEqName = result.EqName;
                string strZoneName = result.ZoneName;

                response.TpsName = strZoneName + " " + strEqName;

                // 상위 장비 조회
                List<ParentEquipInfo> parents = GetTpsParentEquipmentDatas(nTpsNo, out strErrMsg);
                if (parents == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.EquipmentList = parents;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }

        // TPS실 상위-하위 장비 매칭 정보
        public ResponseTpsEquipment GetTpsEquipments(int nParentNo)
        {
            ResponseTpsEquipment response = new ResponseTpsEquipment();

            try
            {
                // TPS 조회
                List<TpsData> tpsDatas = GetTpsListData(out string strErrMsg);
                if (tpsDatas == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<int, string> dicTps = new Dictionary<int, string>();

                foreach (TpsData data in tpsDatas)
                {
                    dicTps[data.TpsNo] = data.TpsName;
                }

                string strSQL = string.Format(@$"SELECT {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqp_zone_sn}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_idntfr}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.model_name}, {EquipmentParent.TableName}.{EquipmentParent.Fields.makr_name}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.stndrd}, {EquipmentParent.TableName}.{EquipmentParent.Fields.ip}, {EquipmentParent.TableName}.{EquipmentParent.Fields.lc}, 
                                                {EquipmentParent.TableName}.{EquipmentParent.Fields.exchng_tm}, {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_memo}, 
                                                {Codes.Fields.code_name}, 
                                                (SELECT COUNT({Equipment.Fields.eqpmn_sn}) FROM {Equipment.TableName} WHERE {Equipment.TableName}.{Equipment.Fields.eqpmn_parnts_sn} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn}) AS ChildCount
                                                FROM {EquipmentParent.TableName} 
                                                INNER JOIN {Codes.TableName} ON {Codes.Fields.code} = {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_no}");

                strSQL += $" WHERE {EquipmentParent.TableName}.{EquipmentParent.Fields.eqpmn_parnts_sn} = {nParentNo}";

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                if (result == null)
                {
                    if (strErrMsg == null)
                        strErrMsg = $"{nParentNo} 값에 해당하는 EquipmentParent 정보가 없습니다.";

                    throw new ApplicationException(strErrMsg);
                }

                ParentEquipmentData parentData = new ParentEquipmentData();

                parentData.EquipmentNo = result.eqpmn_parnts_sn;
                parentData.EquipmentIdenti = result.eqpmn_idntfr;
                parentData.EquipmentName = result.eqpmn_name;

                string strTpsName = null;

                if (result.eqp_zone_sn != null && dicTps.ContainsKey(result.eqp_zone_sn))
                {
                    strTpsName = dicTps[result.eqp_zone_sn];
                }

                parentData.TpsNo = result.eqp_zone_sn;
                parentData.TpsName = strTpsName;
                parentData.ChildCount = result.ChildCount;

                parentData.ModelName = result.model_name;
                parentData.MakerName = result.makr_name;
                parentData.Standard = result.stndrd;
                parentData.IP = result.ip;
                parentData.Location = result.lc;
                parentData.ExchangeTime = result.exchng_tm;
                parentData.TypeNo = result.eqpmn_no;
                parentData.TypeName = result.code_name;
                parentData.Memo = result.eqpmn_memo;

                response.EquipmentData = parentData;

                List<EquipmentInfo> equipmentInfos = GetEquipmentDatas(nParentNo, out strErrMsg);
                if (equipmentInfos == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                parentData.ChildEquipment = new List<ChildEquipmentData>();

                foreach (EquipmentInfo info in equipmentInfos)
                {
                    ChildEquipmentData equipment = new ChildEquipmentData();
                    equipment.ParentNo = nParentNo;
                    equipment.ParentName = result.eqpmn_idntfr;
                    equipment.EquipmentNo = info.EquipmentNo;
                    equipment.EquipmentIdenti = info.EquipmentIdenti;
                    equipment.EquipmentName = info.EquipmentName;
                    equipment.ModelName = info.ModelName;
                    equipment.MakerName = info.MakerName;
                    equipment.Standard = info.Standard;
                    equipment.IP = info.IP;
                    equipment.Location = info.Location;
                    equipment.ExchangeTime = info.ExchangeTime;
                    equipment.TypeNo = info.TypeNo;
                    equipment.TypeName = info.TypeName;
                    equipment.Memo = info.Memo;
                    equipment.ZoneName = info.ZoneName;

                    parentData.ChildEquipment.Add(equipment);
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.EquipmentData = null;
                response.Message = e.Message;
            }

            return response;
        }




        // 엑셀 다운 기능으로 아래 기능은 무시
        public ResponseExcelInfo DownloadExcelEquipments()
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {

                List<EquipmentInfo> equipments = GetEquipmentDatas(null, out strErrorMessage);
                if (equipments == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                byte[] bytes = MakeExcelEquipments(equipments, out strErrorMessage);
                if (bytes == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Bytes = bytes;
                response.FileName = GetFileName(EXCEL_TITLE);
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        private byte[] MakeExcelEquipments(List<EquipmentInfo> equipments, out string strErrorMessage)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            strErrorMessage = null;

            try
            {
                HSSFWorkbook workbook = MakeWorkbook();

                if (workbook == null)
                    return null;

                List<SheetData> sheetDatas = new List<SheetData>();

                // 컬럼 및 데이터 생성
                SheetData sheet = MakeSheet(workbook, equipments);
                sheetDatas.Add(sheet);

                if (sheetDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                // 생성된 데이터로 시트에 채우기
                WriteSheetDatas(workbook, sheetDatas);

                byte[] bytes = null;

                using (MemoryStream stream = new MemoryStream())
                {
                    workbook.Write(stream);
                    bytes = stream.ToArray();
                }

                workbook.Close();
                return bytes;
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return null;
        }

        private HSSFWorkbook MakeWorkbook()
        {
            string strCompany = "금융결제원";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook(/*stream*/);

            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            //create a entry of SummaryInformation
            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = EXCEL_TITLE;
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        private SheetData MakeSheet(HSSFWorkbook workbook, List<EquipmentInfo> equipments)
        {
            int historyCount = equipments.Count;
            string strSubject = EXCEL_TITLE;

            SheetData sheetData = new SheetData(strSubject);
            SetTitles(workbook, sheetData, historyCount);

            Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();

            for (int i = 0; i < historyCount; i++)
            {
                var equipment = equipments[i];

                int index = 0;

                m_dicColumnWidths[index] = 40;
                sheetData.ColumnDatas[index++].Add((i + 1).ToString());

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.TypeName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.EquipmentName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.ModelName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.Standard));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.IP));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.Location));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.ExchangeTime));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(equipment.Memo));


                for (int j = 0; j < index; j++)
                {
                    SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = RowHeight;
            }

            return sheetData;
        }

        void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas)
        {
            foreach (SheetData sheetData in sheetDatas)
            {
                ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

                if (sheet == null)
                    return;

                int nextRowIndex = WritePrev(sheet, workbook);

                IRow row = sheet.CreateRow(nextRowIndex);

                if (sheetData.TitleRowHeight != null)
                    row.HeightInPoints = (int)sheetData.TitleRowHeight;

                int min, max;

                if (GetMinMax(sheetData.Titles, out max, out min) == false)
                    continue;

                string strTitle;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.Titles.TryGetValue(i, out strTitle))
                    {
                        ICell cell = row.CreateCell(i);

                        ICellStyle style;

                        if (sheetData.TitleStyles.TryGetValue(i, out style))
                            cell.CellStyle = style;

                        if (cell != null && strTitle != null)
                            cell.SetCellValue(strTitle);
                    }
                }

                List<string> values;
                // Key : Column Index
                Dictionary<int, IRow> dicColumnRows = new Dictionary<int, IRow>();

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out values))
                    {
                        int nValueCount = values.Count;

                        for (int j = 0; j < nValueCount; j++)
                        {
                            if (dicColumnRows.TryGetValue(j, out row) == false)
                            {
                                row = sheet.CreateRow(j + 1 + nextRowIndex);
                                dicColumnRows[j] = row;

                                int rowHeight;

                                if (sheetData.RowHeight.TryGetValue(j, out rowHeight))
                                    row.HeightInPoints = rowHeight;
                            }

                            string str = values[j];
                            ICell cell = row.CreateCell(i);

                            Dictionary<int, ICellStyle> dicStyles;

                            if (sheetData.CellStyles.TryGetValue(i, out dicStyles))
                            {
                                ICellStyle style;

                                if (dicStyles.TryGetValue(j, out style))
                                    cell.CellStyle = style;
                            }

                            if (cell != null && str != null)
                                cell.SetCellValue(str);
                        }
                    }
                }

                WritePost(sheet, workbook);
            }
        }

        void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {

        }

        bool GetMinMax(Dictionary<int, string> dicTitles, out int max, out int min)
        {
            max = -1;
            min = 1;

            foreach (KeyValuePair<int, string> pair in dicTitles)
            {
                if (min > max)
                {
                    min = max = pair.Key;
                }
                else
                {
                    if (min > pair.Key)
                        min = pair.Key;

                    if (max < pair.Key)
                        max = pair.Key;
                }
            }

            return min <= max;
        }

        int WritePrev(ISheet sheet, HSSFWorkbook workbook)
        {
            ICellStyle styleNormalLeft = GetNormalStyle(workbook, HorizontalAlignment.Left);
            CreateTitle(sheet, workbook);

            IRow row = null;
            ICell cell = null;

            int i = 2;

            //IRow row = CreateRow(sheet, 2);
            //ICell cell = row.CreateCell(0);
            //cell.CellStyle = styleNormalLeft;
            //cell.SetCellValue("센서 유형 : " + GetSensorTypeName());

            //row = CreateRow(sheet, 3);
            //cell = row.CreateCell(0);
            //cell.CellStyle = styleNormalLeft;
            //cell.SetCellValue("위치 : " + GetLocationName(m_dataManager, m_data.SensorNo, m_data.ZoneNo, m_data.BuildingNo, m_data.BuildingGroupNo));

            //if (requestData.BeginYear != -1 && requestData.BeginMonth != -1 && requestData.BeginDay != -1 && requestData.EndYear != -1 && requestData.EndMonth != -1 && requestData.EndDay != -1)
            //{
            //    row = CreateRow(sheet, i);
            //    cell = row.CreateCell(0);
            //    cell.CellStyle = styleNormalLeft;
            //    cell.SetCellValue("조회 기간 : " + GetPeriod(requestData.BeginYear, requestData.BeginMonth, requestData.BeginDay, requestData.EndYear, requestData.EndMonth, requestData.EndDay));

            //    i++;
            //}

            row = CreateRow(sheet, i);
            i++;

            return i;
        }

        void CreateTitle(ISheet sheet, HSSFWorkbook workbook)
        {
            IRow row = CreateRow(sheet, 0);
            ICell firstCell = row.CreateCell(0);

            firstCell.CellStyle = GetTitleStyle(workbook, true, true, false, false);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                row.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, true, false, false);
            }

            row.CreateCell(m_nColumnCount - 1).CellStyle = GetTitleStyle(workbook, false, true, true, false);

            IRow nextRow = CreateRow(sheet, 1);

            nextRow.CreateCell(0).CellStyle = GetTitleStyle(workbook, true, false, false, true);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                nextRow.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, false, false, true);
            }

            nextRow.CreateCell(m_nColumnCount - 1).CellStyle = GetTitleStyle(workbook, false, false, true, true);

            string strSubject = EXCEL_TITLE;
            firstCell.SetCellValue(strSubject);
            Merge(sheet, 0, 1, 0, m_nColumnCount - 1);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            for (int i = 0; i < m_nColumnCount; i++)
            {
                sheet.SetColumnWidth(i, GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }
        }

        private ICellStyle GetTitleStyle(HSSFWorkbook workbook, bool left, bool top, bool right, bool bottom)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            if (left)
                style.BorderLeft = BorderStyle.Medium;

            if (top)
                style.BorderTop = BorderStyle.Medium;

            if (right)
                style.BorderRight = BorderStyle.Medium;

            if (bottom)
                style.BorderBottom = BorderStyle.Medium;

            IFont font = workbook.CreateFont();

            font.IsBold = true;
            font.FontHeightInPoints = TitleFontSize;

            style.SetFont(font);
            return style;
        }

        private void SetBodyStyle(HSSFWorkbook workbook, SheetData sheetData, Dictionary<int, ICellStyle> dicStyles, int rowIndex, int historyCount, int columnIndex, int columnCount)
        {
            int rowMode = 0;

            if (rowIndex == 0)
                rowMode = (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top;

            if (rowIndex == historyCount - 1)
                rowMode |= (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom;

            if (rowIndex > 0 && rowIndex < historyCount - 1)
                rowMode = (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle;

            dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode;

            if (columnIndex == 0)
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left;
            else if (columnIndex == columnCount - 1)
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right;
            else
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle;

            ICellStyle style = GetBodyStyle(workbook, dicStyles, headerMode, rowMode);

            Dictionary<int, ICellStyle> _dicStyles;

            if (sheetData.CellStyles.TryGetValue(columnIndex, out _dicStyles) == false)
            {
                _dicStyles = new Dictionary<int, ICellStyle>();
                sheetData.CellStyles[columnIndex] = _dicStyles;
            }

            _dicStyles[rowIndex] = style;
        }

        private ICellStyle GetBodyStyle(HSSFWorkbook workbook, Dictionary<int, ICellStyle> dicStyles, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode, int rowMode)
        {
            ICellStyle style;
            int key = (((int)headerMode) << 16) | rowMode;

            if (dicStyles.TryGetValue(key, out style))
                return style;

            style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            if (IsTop(rowMode))
            {
                style.BorderTop = BorderStyle.Double;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else if (IsVMiddle(rowMode))
            {
                style.BorderTop = BorderStyle.Dotted;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else
            {
                style.BorderTop = BorderStyle.Dotted;
                style.BorderBottom = BorderStyle.Medium;
            }

            if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }
            else
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }

            dicStyles[key] = style;
            return style;
        }

        private ICellStyle GetNormalStyle(HSSFWorkbook workbook, HorizontalAlignment alignment)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = alignment;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;

            style.SetFont(font);
            return style;
        }
        static bool IsTop(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top)
                return true;

            return false;
        }

        static bool IsVMiddle(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle)
                return true;

            return false;
        }

        static bool IsBottom(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom)
                return true;

            return false;
        }

        private string GetText(string strText)
        {
            if (strText != null && strText.Length > 0)
                return strText;

            return "-";
        }

        private string GetText(DateTime? time)
        {
            if (time == null)
                return "-";

            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", ((DateTime)time).Year, ((DateTime)time).Month, ((DateTime)time).Day, ((DateTime)time).Hour, ((DateTime)time).Minute, ((DateTime)time).Second);
        }

        private double GetColumnWidth(double standardPixelWidth, double standardWidth, double dPixelWidth)
        {
            return standardWidth * dPixelWidth / standardPixelWidth;
        }

        private IRow CreateRow(ISheet sheet, int index)
        {
            IRow row = sheet.CreateRow(index);
            row.HeightInPoints = RowHeight;
            return row;
        }

        private void Merge(ISheet sheet, int beginRowIndex, int endRowIndex, int beginColumnIndex, int endColumnIndex)
        {
            //Merging Cells
            NPOI.SS.Util.CellRangeAddress mergedBatch = new NPOI.SS.Util.CellRangeAddress(beginRowIndex, endRowIndex, beginColumnIndex, endColumnIndex);
            sheet.AddMergedRegion(mergedBatch);
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            int index = 0;

            // 장비 리스트
            sheetData.Titles[index++] = Column_No;
            sheetData.Titles[index++] = Column_EquipmentType;
            sheetData.Titles[index++] = Column_EquipmentName;
            sheetData.Titles[index++] = Column_Model;
            sheetData.Titles[index++] = Column_Standard;
            sheetData.Titles[index++] = Column_IP;
            sheetData.Titles[index++] = Column_Location;
            sheetData.Titles[index++] = Column_ExChangeTime;
            sheetData.Titles[index++] = Column_Memo;

            ICellStyle leftHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left);
            ICellStyle middleHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle);
            ICellStyle rightHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right);

            if (historyCount == 0)
            {
                leftHeader.BorderBottom = BorderStyle.Medium;
                middleHeader.BorderBottom = BorderStyle.Medium;
                rightHeader.BorderBottom = BorderStyle.Medium;
            }

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();

                if (pair.Key == 0)
                    sheetData.TitleStyles[pair.Key] = leftHeader;
                //else if (pair.Key == index - 1)
                //    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;

            return;
        }

        private ICellStyle GetHeaderStyle(HSSFWorkbook workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            style.BorderTop = BorderStyle.Medium;
            style.BorderBottom = BorderStyle.Double;

            if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }

            style.FillPattern = FillPattern.SolidForeground;
            style.FillForegroundColor = IndexedColors.LightTurquoise.Index;
            return style;
        }

        private string GetFileName(string strTag)
        {
            DateTime dtNow = DateTime.Now;
            return string.Format("{0}_{1}{2:00}{3:00}_{4:00}{5:00}{6:00}.xls", strTag, dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
        }
    }
}

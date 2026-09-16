using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;
using Base.SDMS.IBLL.Request;
using Base.Model.Spatial;
using Base.SDMS.IBLL.Models;

namespace Base.SDMS.BLL.Process
{
    class EquipZoneManager
    {
        private IDataManager m_dataManager = null;

        public EquipZoneManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public MessageResult UpdateEquipZones(UpdateEquipZones data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone(); ;

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            foreach (var updateData in data.UpdateDatas)
            {
                string strCondition = null;
                Dictionary<EquipmentZone.Fields, object> dicSets = null;

                if (updateData.EquipZoneNo >= 0)
                {
                    strCondition = string.Format("{0} = {1}", EquipmentZone.Fields.eqp_zone_sn, updateData.EquipZoneNo);
                    dicSets = CheckPosition(updateData);
                    CheckName(updateData, ref dicSets);

                    if (dicSets != null)
                    {
                        if (dataManager.GetUpdate().Update<EquipmentZone, EquipmentZone.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);
                            return new MessageResult(false, strErrorMessage);
                        }
                    }
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        private bool CheckName(UpdateEquipZoneData data, ref Dictionary<EquipmentZone.Fields, object> dicSets)
        {
            if (data.Name != null)
            {
                if (dicSets == null)
                    dicSets = new Dictionary<EquipmentZone.Fields, object>();

                dicSets[EquipmentZone.Fields.disp_text] = data.Name;
                return true;
            }

            return false;
        }

        private Dictionary<EquipmentZone.Fields, object> CheckPosition(UpdateEquipZoneData data)
        {
            if (data.X != null && data.Y != null && data.Z != null)
            {
                Dictionary<EquipmentZone.Fields, object> dicSets = new Dictionary<EquipmentZone.Fields, object>();
                dicSets[EquipmentZone.Fields.text_center_crdnt_x] = data.X;
                dicSets[EquipmentZone.Fields.text_center_crdnt_y] = data.Y;
                dicSets[EquipmentZone.Fields.text_center_crdnt_z] = data.Z;

                return dicSets;
            }

            return null;
        }
    }
}

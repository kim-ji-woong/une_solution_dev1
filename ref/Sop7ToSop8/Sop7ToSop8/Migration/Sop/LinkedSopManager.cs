using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class LinkedSopManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public LinkedSopManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 알람연계 데이터를 읽어옵니다.");
            string strErrorMessage;

            IDataManager dataManager = m_client.Sop8DataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            if (ReadSop7(dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            m_client.SendStatus("SOP 알람연계 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, FacilityTypeID, DisasterCategoryID, SubDisasterCategoryID, DisasterName, LinkedBuildingID, LinkedZoneID, Description, LinkedBuildingGroupID from SopConfigLinkedSop";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + LinkedSopEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + LinkedSopEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + LinkedSopEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + LinkedSopEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            LinkedSopEx sop = new LinkedSopEx();
            sop.link_sop_sn = data.ID;
            sop.sensor_ty_optn_code = (int)CodeType.SensorType;
            sop.sensor_ty_code = data.FacilityTypeID;
            sop.buld_group_sn = data.LinkedBuildingGroupID;
            sop.buld_sn = data.LinkedBuildingID;
            sop.zone_sn = data.LinkedZoneID;
            sop.lclas_sn = data.DisasterCategoryID;
            sop.mclas_sn = data.SubDisasterCategoryID;
            sop.sclas_name = data.DisasterName;
            sop.site_sn = m_nSop8SiteNo;
            sop.descp = data.Description;

            return dataManager.GetCreate().Insert<LinkedSopEx>(sop, out strErrorMessage);
        }

        private int GetComponentNo(int componentID)
        {
            int componentType = (int)(componentID >> 24);

            if (componentType == 0)
                return ProcessManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 1)
                return DecisionManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 2)
                return CommentManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 3)
                return EndpointManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 6)
                return TransmissionManager.GetSectionNumber(componentID & 0x00ffffff);

            return -1;
        }

        private int GetArrowPosition(int pos)
        {
            return (int)CodeType.ArrowPosition + pos;
        }
    }
}

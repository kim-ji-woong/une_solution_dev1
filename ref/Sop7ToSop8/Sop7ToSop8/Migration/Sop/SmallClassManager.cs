using System.Collections.Generic;
using Base.Model.Sop.Category;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class SmallClassManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SmallClassManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 소분류 데이터를 읽어옵니다.");
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

            m_client.SendStatus("SOP 소분류 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select a.ID ID, a.DisasterName DisasterName, a.SubDisasterCategoryID SubDisasterCategoryID, a.VersionID VersionID, a.UserLevelIDs UserLevelIDs, a.Description Description, b.isNormal isNormal ";
            strSQL += "from SopCategoryDisaster a inner join SopCategoryVersion b on a.VersionID = b.ID";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + SmallClassEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SmallClassEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SmallClassEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SmallClassEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            SmallClassEx model = new SmallClassEx();
            model.sclas_sn = data.ID;
            model.mclas_sn = data.SubDisasterCategoryID;
            model.sclas_name = data.DisasterName;
            model.ver_sn = data.VersionID;
            model.nor_yn = data.isNormal;
            model.descp = data.Description;

            return dataManager.GetCreate().Insert<SmallClass>(model, out strErrorMessage);
        }
    }
}

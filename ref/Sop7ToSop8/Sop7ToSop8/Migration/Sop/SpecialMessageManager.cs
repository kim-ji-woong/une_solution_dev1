using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Config;

namespace Sop7ToSop8.Migration.Sop
{
    class SpecialMessageManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SpecialMessageManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 특수문자 데이터를 읽어옵니다.");
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

            m_client.SendStatus("SOP 특수문자 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, Category, Message, description from SopConfigSpecialMessage";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            SpecialCharactor spch = new SpecialCharactor();
            spch.spcl_chrctr_sn = data.ID;
            spch.cl = data.Category;
            spch.contents = data.Message;
            spch.descp = data.description;

            return dataManager.GetCreate().Insert<SpecialCharactor>(spch, out strErrorMessage);
        }
    }
}

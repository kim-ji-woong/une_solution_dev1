using System.Collections.Generic;
using Base.Model.Account;

namespace Sop7ToSop8.Migration.Account
{
    class GradeManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public GradeManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("계정등급 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("계정등급 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, LevelName from SopAccountLevel";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSop8(dynamic data, out string strErrorMessage)
        {
            Grade grade = new Grade();
            grade.grad_sn = data.ID;
            grade.grad_name = data.LevelName;

            if (m_client.Sop8DataManager.GetCreate().Insert<Grade>(grade, out strErrorMessage) == false)
                return false;

            return true;
        }
    }
}

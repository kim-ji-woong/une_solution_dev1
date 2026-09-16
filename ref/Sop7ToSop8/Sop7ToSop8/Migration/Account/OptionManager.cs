using System.Collections.Generic;
using Base.Model.Account;

namespace Sop7ToSop8.Migration.Account
{
    class OptionManager
    {
        private IMigrationClient m_client = null;
        
        public OptionManager(IMigrationClient client)
        {
            m_client = client;
        }

        public bool Run()
        {
            m_client.SendStatus("계정별 옵션 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("계정별 옵션 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4 from SopAccountOption";
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
            Base.Model.Account.Option option = new Base.Model.Account.Option();
            option.user_sn = data.UserID;
            option.optn_cl = data.Category;
            option.optn_sclas = data.SubCategory;

            option.optn_indx = 1;
            option.optn_value = data.PropertyValue1;

            if (m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Account.Option>(option, out strErrorMessage) == false)
                return false;

            option.optn_indx = 2;
            option.optn_value = data.PropertyValue2;

            if (m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Account.Option>(option, out strErrorMessage) == false)
                return false;

            option.optn_indx = 3;
            option.optn_value = data.PropertyValue3;

            if (m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Account.Option>(option, out strErrorMessage) == false)
                return false;

            option.optn_indx = 4;
            option.optn_value = data.PropertyValue4;

            if (m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Account.Option>(option, out strErrorMessage) == false)
                return false;

            return true;
        }
    }
}

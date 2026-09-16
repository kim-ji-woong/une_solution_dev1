using System.Collections.Generic;
using Base.Model.Common.Team;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Team
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
            m_client.SendStatus("팀 옵션 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("팀 옵션 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select PropertyID, PropertyName, PropertyValue from SopTeamOptions order by PropertyName, PropertyID";
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
            Base.Model.Common.Team.Option option = new Base.Model.Common.Team.Option();
            option.team_optn_ty_no = GetOptionTypeNo(data.PropertyName);
            option.team_optn_no = option.team_optn_ty_no + data.PropertyID;
            option.team_optn_name = data.PropertyValue;

            return m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Common.Team.Option>(option, out strErrorMessage);
        }

        private int GetOptionTypeNo(string strType)
        {
            strType = strType.ToLower();

            if (strType == "joblevel")
                return (int)CodeType.JobLevel;
            else if (strType == "jobposition")
                return (int)CodeType.JobPosition;
            else if (strType == "jobstatus" || strType == "status")
                return (int)CodeType.JobStatus;

            return 0;
        }
    }
}

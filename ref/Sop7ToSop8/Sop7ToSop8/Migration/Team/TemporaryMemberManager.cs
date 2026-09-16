using System.Collections.Generic;
using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Team
{
    using Models;

    class TemporaryMemberManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public TemporaryMemberManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("비상조직원 데이터를 읽어옵니다.");
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

            m_client.SendStatus("비상조직원 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, DisplaySOPName, TeamID, RegularID, RegularMemberID, IsNormal, Role from SopTeamTemporaryMember";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + TemporaryMember.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + TemporaryMember.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + TemporaryMember.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + TemporaryMember.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            TemporaryMemberEx member = new TemporaryMemberEx();
            member.tmpr_memb_sn = data.ID;
            member.tmpr_sn = data.TeamID;
            member.disp_name = data.DisplaySOPName;
            member.rgl_sn = data.RegularID;
            member.rgl_memb_sn = data.RegularMemberID;

            if (data.Role != null)
            {
                member.role_optn_no = (int)CodeType.Role;
                member.role_no = member.role_optn_no + data.Role;
            }

            if (dataManager.GetCreate().Insert<TemporaryMemberEx>(member, out strErrorMessage) == false)
                return false;

            return true;
        }

        // 암호화되지 않은 전화번호의 경우 숫자만 남기고 모두 지운다.
        private string GetValidPhoneNumber(string strPhoneNumber)
        {
            if (strPhoneNumber == null)
                return strPhoneNumber;

            strPhoneNumber = strPhoneNumber.Trim();

            string strValidPhoneNumber = "";
            int len = strPhoneNumber.Length;

            for (int i = 0; i < len; i++)
            {
                char ch = strPhoneNumber[i];

                if (ch >= '0' && ch <= '9')
                {
                    strValidPhoneNumber += ch;
                }
            }

            // 전화번호가 11자리가 넘는다면 null로 만든다.
            // 올바른 전화번호가 아닐 가능성이 높다.
            if (strValidPhoneNumber.Length > 11)
                strValidPhoneNumber = null;

            return strValidPhoneNumber;
        }
    }
}

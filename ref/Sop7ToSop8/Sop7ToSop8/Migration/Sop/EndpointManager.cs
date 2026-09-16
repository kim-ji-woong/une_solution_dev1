using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Component;

namespace Sop7ToSop8.Migration.Sop
{
    class EndpointManager
    {
        private const int AddNumber = 40000;
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public EndpointManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 시작/끝 데이터를 읽어옵니다.");
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

            m_client.SendStatus("SOP 시작/끝 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, GridID, GridRowIndex, GridColumnIndex, text, isBegin, StepMemberID, SectionNumber from SopComponentEndPoint";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + Component.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Component.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            if (ComponentManager.CreateComponent(dataManager, dnsData.CommonCode.Sop.ComponentType.Endpoint, AddNumber, data, out strErrorMessage) == false)
                return false;

            Endpoint section = new Endpoint();
            section.compn_sn = data.ID + AddNumber;
            section.title = data.text;
            section.begin_yn = data.isBegin;
            section.execut_no = data.SectionNumber;

            return dataManager.GetCreate().Insert<Endpoint>(section, out strErrorMessage);
        }

        public static int GetSectionNumber(int sop7ID)
        {
            return sop7ID + AddNumber;
        }
    }
}

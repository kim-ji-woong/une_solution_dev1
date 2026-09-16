using DapperSample.BLL.DataAccessLayer.IDAL;
using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.BLL
{
    public class SaveManager
    {
        private IDataManager2 m_dataManager = null;
        public SaveManager(IDataManager2 dataManager)
        {
            m_dataManager = dataManager;
        }

        public int AddRegular(string strTeamName)
        {
            Regular regular = new Regular();
            regular.ParentTeamID = null;
            regular.TeamName = strTeamName;
            regular.SiteID = 1;

            string strErrMsg = null;
            int nID;
            //bool result = m_dataManager.GetCreate().Insert<Regular, Regular.WriteFields>(regular, out strErrMsg);
            bool result = m_dataManager.GetCreate().Insert<Regular>(regular, out nID, out strErrMsg);

            NoIDTable noIDTable = new NoIDTable();
            noIDTable.Test1 = "1";
            noIDTable.Test2 = "2";

            int nID2;
            m_dataManager.GetCreate().Insert<NoIDTable>(noIDTable, out nID2, out strErrMsg);

            return nID;           
        }

        public void AddRegulars()
        {
            List<Regular> regulars = new List<Regular>();
            for (int i = 0; i < 10; i++)
            {
                regulars.Add(new Regular()
                {
                    TeamName = "부서" + i,
                    SiteID = 1,
                    ParentTeamID = null                    
                });
            }

            string strErrMsg;
            bool result = m_dataManager.GetCreate().Insert<Regular>(regulars, out strErrMsg);
        }

        public void UpdateRegular()
        {
            //int nID = AddRegular("수정할 팀");

            string strErrMsg = null;
            //// case 1
            //Dictionary<Regular.Fields, object> dicSets = new Dictionary<Regular.Fields, object>();
            //dicSets.Add(Regular.Fields.TeamName, "수정할 팀 (수정)");
            //dicSets.Add(Regular.Fields.SiteID, 100);

            //m_dataManager.GetUpdate().Update<Regular, Regular.Fields>(dicSets, $"{Regular.Fields.ID}={nID}", out strErrMsg);

            //// case 2
            //Regular regular = m_dataManager.GetSelect().SelectFirst<Regular>($"ID={nID}", out strErrMsg);
            //regular.TeamName = "수정할 팀 (수정)-1";
            //regular.SiteID = 101;

            //m_dataManager.GetUpdate().Update<Regular>(regular, $"{Regular.Fields.ID}={nID}", out strErrMsg);


            //case 3 List Update
            List<Regular> regulars = new List<Regular>();
            Regular regular = new Regular();
            regular.ID = 27;
            regular.TeamName = "A";
            regular.SiteID = 100;
            regulars.Add(regular);

            Regular regular2 = new Regular();
            regular2.ID = 28;
            regular2.TeamName = "B";
            regular2.SiteID = 100;
            regulars.Add(regular2);

            Regular regular3 = new Regular();
            regular3.ID = 29;
            regular3.TeamName = "C";
            regular3.SiteID = 100;
            regulars.Add(regular3);

            bool result = m_dataManager.GetUpdate().Update<Regular>(regulars, out strErrMsg);
        }

        public void DeleteRegular()
        {
            int nID = AddRegular("삭제할 팀");
            
            string strErrMsg = null;
            m_dataManager.GetDelete().Delete<Regular>($"{Regular.Fields.ID}={nID}", out strErrMsg);
        }

        public int TransactionTest()
        {
            IDataManager2 dataManager = (IDataManager2)m_dataManager.Clone();
            string strErrMsg;
            try
            {                
                dataManager.BeginBatch(out strErrMsg);

                Regular regular = new Regular();
                regular.ParentTeamID = null;
                regular.TeamName = "3333333";
                regular.SiteID = 1;

                int nID;
                dataManager.GetCreate().Insert<Regular>(regular, out nID, out strErrMsg);

                Regular result = dataManager.GetSelect().SelectFirst<Regular>($"ID={nID}", out strErrMsg);

                RegularMember member = new RegularMember();
                member.RegularID = nID;
                member.MemberName = "33333333홍";

                int nID2;
                dataManager.GetCreate().Insert<RegularMember>(member, out nID2, out strErrMsg);

                string strSQL = $@"
                    select *
                      from {Regular.TableName} r
                inner join {RegularMember.TableName} m on r.{Regular.Fields.ID}=m.{RegularMember.Fields.RegularID}";
                
                IEnumerable<RegularMemberData> join = dataManager.GetSelect().Select<Regular, RegularMember, RegularMemberData>(strSQL, new RegularMemberData(), out strErrMsg);

                IEnumerable<Regular> join2 = dataManager.GetSelect().JoinRegular(out strErrMsg);

                //throw new ApplicationException("오류");
                dataManager.BatchCommit(out strErrMsg);

                dataManager.BeginBatch(out strErrMsg);

                regular = new Regular();
                regular.ParentTeamID = null;
                regular.TeamName = "4444444444";
                regular.SiteID = 1;

                dataManager.GetCreate().Insert<Regular>(regular, out nID, out strErrMsg);

                result = dataManager.GetSelect().SelectFirst<Regular>($"ID={nID}", out strErrMsg);

                member = new RegularMember();
                member.RegularID = nID;
                member.MemberName = "44444444홍";

                dataManager.GetCreate().Insert<RegularMember>(member, out nID2, out strErrMsg);

                dataManager.BatchCommit(out strErrMsg);

                return nID2;
            }
            catch (Exception)
            {
                dataManager.BatchRollback(out strErrMsg);
                return -1;
            }
        }
    }
}

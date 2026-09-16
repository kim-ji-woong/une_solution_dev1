using DapperSample.BLL.DataAccessLayer.IDAL;
using DapperSample.Model;
//using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.BLL
{
    public class LoadManager
    {
        private IDataManager2 m_dataManager = null;
        public LoadManager(IDataManager2 dataManager)
        {
            m_dataManager = dataManager;
        }

        public void LoadRegular()
        {
            string strSQL = string.Empty;
            string strErrMsg;

            //dynamic dy = m_dataManager.GetSelect().SelectFirst("Select convert(varchar(19), GetDate(), 120) dt", out strErrMsg);
            //DateTime dt = Convert.ToDateTime(dy.dt);

            strSQL = $@"
                select sz.ID SensorZoneID, sz.SensorType, sti.ID SensorTagInfoID 
                  from SdmsSensorZone sz
                 inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                 where sz.ID in (18)";

            string strError;
            dynamic arrDatas = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
            if (arrDatas == null || arrDatas.Count < 2)
                return;


            // 1. 통으로 조회
            Regular regular = m_dataManager.GetSelect().SelectFirst<Regular>($"{Regular.Fields.ID}=27", out strErrMsg);
            IEnumerable<Regular> regulars = m_dataManager.GetSelect().Select<Regular>(null, out strErrMsg);
            IEnumerable<RegularMember> regularMembers = m_dataManager.GetSelect().Select<RegularMember>(null, out strErrMsg);

            // 2. 필요한 필드만 조회
            strSQL = $"select {RegularMember.Fields.ID},{RegularMember.Fields.MemberName} from {RegularMember.TableName}";
            IEnumerable<dynamic> returnDynamic = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
            foreach (var item in returnDynamic)
            {
                // case 1
                var data = item as IDictionary<string, object>;
                int nID = (int)data[RegularMember.Fields.ID.ToString()];
                string strMemberName = (string)data[RegularMember.Fields.MemberName.ToString()];

                // case 2
                nID = item.ID;
                strMemberName = item.MemberName;
            }

            strSQL = $"select count(*) cnt from {RegularMember.TableName}";
            dynamic returnDynamic2 = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
            int nCnt= returnDynamic2.cnt;


            // 3. 조인
            // 3-1. Regular, RegularMember Join 전체 리스트
            strSQL = $@"
                select *
                  from {Regular.TableName} r
            inner join {RegularMember.TableName} m on r.{Regular.Fields.ID}=m.{RegularMember.Fields.RegularID}";
            IEnumerable<RegularMemberData> join = m_dataManager.GetSelect().Select<Regular, RegularMember, RegularMemberData>(strSQL, new RegularMemberData(), out strErrMsg);
            
            // 3-2. 각 Regular에 RegularMember 리스트 넣기
            IEnumerable<Regular> join2 = m_dataManager.GetSelect().JoinRegular(out strErrMsg);

            foreach (RegularMember regularMember in regularMembers)
            {
                regularMember.MemberName += "_no1";

                if (m_dataManager.GetUpdate().Update<RegularMember>(regularMember, null, out strErrMsg) == false)
                    System.Diagnostics.Trace.WriteLine(strErrMsg);
                break;
            }
        }

        public void LoadOracle()
        {
            /*TB_INVERTER tbTemp = new TB_INVERTER()
            {
                REPORT_DT = Convert.ToDateTime("2023-09-14"),
                INVERTER_NO = 100,
                SUN_VOLTAGE = 101,
                SUN_CURRENT = 102,
                SUN_POWER = 103,
                RS = 104,
                ST = 105,
                TR = 106,
                R = 107,
                S = 108,
                T = 109,
                POWER = 110,
                PF = 111,
                PRQ = 112,
                ACCRUE_POWER = 113,
                STATUS = "1000000000000000000"
            };

            if (!m_dataManager.GetCreate().Insert<TB_INVERTER>(tbTemp, out string strErrMsg))
                return;

            IEnumerable<TB_INVERTER> tb = m_dataManager.GetSelect().Select<TB_INVERTER>(null, out string strErrMsg2);*/
        }
    }
}

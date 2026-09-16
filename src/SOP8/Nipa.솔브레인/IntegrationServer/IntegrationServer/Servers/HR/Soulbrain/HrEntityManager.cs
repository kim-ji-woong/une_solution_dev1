using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace IntegrationServer.Servers.HR.Soulbrain
{
    public class HrEntityManager
    {
        private DataManager m_HrDataManager = null;
        
        public HrEntityManager(DataManager hrDataManager)
        {
            m_HrDataManager = hrDataManager;
        }

        public List<HRData.Team> GetHrTeamList(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            List<HRData.Team> listHrRegular = new List<HRData.Team>();

            string strHrRegularSQL = $@"
                                        WITH by_cd AS (
                                                SELECT
                                                ENTER_CD, ENTER_NM, SDATE, ORG_CD, ORG_NM, PRIOR_ORG_CD,
                                                ORDER_SEQ, ORG_LEVEL, CHKDATE, CHKID,
                                                ROW_NUMBER() OVER (
                                                    PARTITION BY ORG_CD
                                                    ORDER BY SDATE DESC, ORDER_SEQ, ORG_LEVEL
                                                ) AS rn_cd
                                            FROM Team
                                        ),
                                        pick_cd AS (
                                            SELECT *
                                            FROM by_cd
                                            WHERE rn_cd = 1
                                        ),
                                        by_nm AS (
                                            SELECT
                                                *,
                                                ROW_NUMBER() OVER (
                                                    PARTITION BY ORG_NM
                                                    ORDER BY SDATE DESC, ORDER_SEQ, ORG_LEVEL
                                                ) AS rn_nm
                                            FROM pick_cd
                                        )
                                        SELECT
                                            ENTER_CD, ENTER_NM, SDATE, ORG_CD, ORG_NM, PRIOR_ORG_CD,
                                            ORDER_SEQ, ORG_LEVEL, CHKDATE, CHKID
                                        FROM by_nm
                                        WHERE rn_nm = 1
                                        ORDER BY ORDER_SEQ, ORG_LEVEL;
                                        ";


            try
            {
                IEnumerable<dynamic> hrRegulars = m_HrDataManager.GetSelect().Select(strHrRegularSQL, out strErrorMessage);

                if (hrRegulars == null)
                {
                    strErrorMessage = "GetHrRegularList() : " + strErrorMessage;
                    return null;
                }

                foreach (dynamic hrRegular in hrRegulars)
                {
                    HRData.Team hrTeam = new HRData.Team();

                    hrTeam.ENTER_CD = hrRegular.ENTER_CD;
                    hrTeam.ENTER_NM = hrRegular.ENTER_NM;
                    hrTeam.SDATE = hrRegular.SDATE;
                    hrTeam.ORG_CD = hrRegular.ORG_CD;
                    hrTeam.ORG_NM = hrRegular.ORG_NM;
                    hrTeam.PRIOR_ORG_CD = hrRegular.PRIOR_ORG_CD;
                    hrTeam.ORDER_SEQ = hrRegular.ORDER_SEQ;
                    hrTeam.ORG_LEVEL = hrRegular.ORG_LEVEL;
                    hrTeam.CHKDATE = hrRegular.CHKDATE;
                    hrTeam.CHKID = hrRegular.CHKID;

                    listHrRegular.Add(hrTeam);
                }
                
                return listHrRegular;
            }
            catch (Exception e)
            {
                strErrorMessage = "GetHrRegularList() : " + e.Message;
                return null;
            }
        }

        public List<HRData.Member> GetHrMemberList(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            List<HRData.Member> listHrRegularMember = new List<HRData.Member>();

            string strHrMemberSQL = $@"
                                       SELECT
                                             SABUN,
                                             NAME,
                                             ORG_CD,
                                             ORG_NM,
                                             STATUS_CD,
                                             STATUS_NM,
                                             JIKWEE_CD,
                                             JIKWEE_NM,
                                             JIKCHAK_CD,
                                             JIKCHAK_NM,
                                             ADDRESS_OT,
                                             ADDRESS_HP,
                                             ADDRESS_IM 
                                       FROM Member 
                                       WHERE 
                                           STATUS_NM NOT IN ('퇴직', '퇴사', '휴직')";

            try
            {
                IEnumerable<dynamic> hrRegularMembers =
                    m_HrDataManager.GetSelect().Select(strHrMemberSQL, out strErrorMessage);
                if (hrRegularMembers == null)
                {
                    strErrorMessage = "GetHrRegularMemberList() : " + strErrorMessage;
                    return null;
                }

                foreach (dynamic hrRegularMember in hrRegularMembers)
                {
                    HRData.Member hrMember = new HRData.Member();
                    hrMember.SABUN = hrRegularMember.SABUN;
                    hrMember.NAME = hrRegularMember.NAME;
                    hrMember.ORG_CD = hrRegularMember.ORG_CD;
                    hrMember.ORG_NM = hrRegularMember.ORG_NM;
                    hrMember.STATUS_CD = hrRegularMember.STATUS_CD;
                    hrMember.STATUS_NM = hrRegularMember.STATUS_NM;
                    hrMember.JIKWEE_CD = hrRegularMember.JIKWEE_CD;
                    hrMember.JIKWEE_NM = hrRegularMember.JIKWEE_NM;
                    hrMember.JIKCHAK_CD = hrRegularMember.JIKCHAK_CD;
                    hrMember.JIKCHAK_NM = hrRegularMember.JIKCHAK_NM;
                    hrMember.ADDRESS_OT = hrRegularMember.ADDRESS_OT;
                    hrMember.ADDRESS_HP = hrRegularMember.ADDRESS_HP;
                    hrMember.ADDRESS_IM = hrRegularMember.ADDRESS_IM;

                    listHrRegularMember.Add(hrMember);
                }
                
                return listHrRegularMember;
                
            }
            catch (Exception e)
            {
                strErrorMessage = "GetHrRegularMemberList() : " + e.Message;
                return null;
            }
        }
    }
}

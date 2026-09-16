using System;
using Base.Model.Common.Team;

namespace IntegrationServer.Servers.HR.Soulbrain
{
    
    public class HRData
    {
        /// <summary>
        /// Soulbrain_HR dbo.Company
        /// </summary>
        public class Company
        {
            
        }

        /// <summary>
        /// Soulbrain_HR dbo.Member
        /// </summary>
        public class Member
        {
            //private string m_strENTER_CD = "";      // 회사구분
            //private string m_strENTER_NM = "";      // 회사명
            private string m_strSABUN = "";         // 사번
            private string m_strNAME = "";          // 성명
            //private string m_strSEX_TYPE = "";      // 성별
            private string m_strORG_CD = "";        // 부서코드
            private string m_strORG_NM = "";        // 부서명
            private string m_strSTATUS_CD = "";     // 재직상태코드
            private string m_strSTATUS_NM = "";     // 재직상태명
            //private string m_strMANAGE_CD = "";     // 사원구분코드
            //private string m_strMANAGE_NM = "";     // 사원구분명
            private string m_strJIKWEE_CD = "";     // 직위코드
            private string m_strJIKWEE_NM = "";     // 직위명
            private string m_strJIKCHAK_CD = "";    // 직책코드
            private string m_strJIKCHAK_NM = "";    // 직책명
            private string m_strADDRESS_OT = "";    // 사내전화번호
            private string m_strADDRESS_HP = "";    // 핸드폰번호
            private string m_strADDRESS_IM = "";    // 메일주소

            //public string ENTER_CD
            //{
            //    get { return m_strENTER_CD; }
            //    set { m_strENTER_CD = value; }
            //}

            //public string ENTER_NM
            //{
            //    get { return m_strENTER_NM; }
            //    set { m_strENTER_NM = value; }
            //}

            public string SABUN
            {
                get { return m_strSABUN; }
                set { m_strSABUN = value; }
            }

            public string NAME
            {
                get { return m_strNAME; }
                set { m_strNAME = value; }
            }

            //public string SEX_TYPE
            //{
            //    get { return m_strSEX_TYPE; }
            //    set { m_strSEX_TYPE = value; }
            //}

            public string ORG_CD
            {
                get { return m_strORG_CD; }
                set { m_strORG_CD = value; }
            }

            public string ORG_NM
            {
                get { return m_strORG_NM; }
                set { m_strORG_NM = value; }
            }

            public string STATUS_CD
            {
                get { return m_strSTATUS_CD; }
                set { m_strSTATUS_CD = value; }
            }

            public string STATUS_NM
            {
                get { return m_strSTATUS_NM; }
                set { m_strSTATUS_NM = value; }
            }

            //public string MANAGE_CD
            //{
            //    get { return m_strMANAGE_CD; }
            //    set { m_strMANAGE_CD = value; }
            //}

            //public string MANAGE_NM
            //{
            //    get { return m_strMANAGE_NM; }
            //    set { m_strMANAGE_NM = value; }
            //}

            public string JIKWEE_CD
            {
                get { return m_strJIKWEE_CD; }
                set { m_strJIKWEE_CD = value; }
            }

            public string JIKWEE_NM
            {
                get { return m_strJIKWEE_NM; }
                set { m_strJIKWEE_NM = value; }
            }

            public string JIKCHAK_CD
            {
                get { return m_strJIKCHAK_CD; }
                set { m_strJIKCHAK_CD = value; }
            }

            public string JIKCHAK_NM
            {
                get { return m_strJIKCHAK_NM; }
                set { m_strJIKCHAK_NM = value; }
            }

            public string ADDRESS_OT
            {
                get { return m_strADDRESS_OT; }
                set { m_strADDRESS_OT = value; }
            }

            public string ADDRESS_HP
            {
                get { return m_strADDRESS_HP; }
                set { m_strADDRESS_HP = value; }
            }

            public string ADDRESS_IM
            {
                get { return m_strADDRESS_IM; }
                set { m_strADDRESS_IM = value; }
            }
        }

        
        /// <summary>
        /// Soulbrain_HR dbo.Team
        /// </summary>
        public class Team
        {
            private string m_strENTER_CD = "";
            private string m_strENTER_NM = "";
            private string m_strSDATE = "";
            private string m_strORG_CD = "";
            private string m_strORG_NM = "";
            private string m_strPRIOR_ORG_CD = null;
            private string m_strORDER_SEQ = null;
            private string m_strORG_LEVEL = null;
            private DateTime m_dtCHKDATE = new DateTime();
            private string m_strCHKID = null;
            
            public string ENTER_CD
            {
                get { return m_strENTER_CD; }
                set { m_strENTER_CD = value; }
            }

            public string ENTER_NM
            {
                get { return m_strENTER_NM; }
                set { m_strENTER_NM = value; }
            }

            public string SDATE
            {
                get { return m_strSDATE; }
                set { m_strSDATE = value; }
            }


            public string ORG_CD
            {
                get { return m_strORG_CD; }
                set { m_strORG_CD = value; }
            }

            public string ORG_NM
            {
                get { return m_strORG_NM; }
                set { m_strORG_NM = value; }
            }

            public string PRIOR_ORG_CD
            {
                get { return m_strPRIOR_ORG_CD; }
                set { m_strPRIOR_ORG_CD = value; }
            }

            public string ORDER_SEQ
            {
                get { return m_strORDER_SEQ; }
                set { m_strORDER_SEQ = value; }
            }

            public string ORG_LEVEL
            {
                get { return m_strORG_LEVEL; }
                set { m_strORG_LEVEL = value; }
            }

            public DateTime CHKDATE
            {
                get { return m_dtCHKDATE; }
                set { m_dtCHKDATE = value; }
            }

            public string CHKID
            {
                get { return m_strCHKID; }
                set { m_strCHKID = value; }
            }
        }

        public class HrRegular : Regular
        {
            private string m_strORG_CD = null;
            private string m_strPRIOR_ORG_CD = null;
            private string m_strORG_LEVEL = null;
            
            public string ORG_CD
            {
                get { return m_strORG_CD; }
                set { m_strORG_CD = value; }
            }
            
            public string PRIOR_ORG_CD
            {
                get { return m_strPRIOR_ORG_CD; }
                set { m_strPRIOR_ORG_CD = value; }
            }
            
            public string ORG_LEVEL
            {
                get { return m_strORG_LEVEL; }
                set { m_strORG_LEVEL = value; }
            }
            
        }

        public class HrRegularMember : RegularMember
        {
            private string m_strORG_CD = null;
            private string m_strJIKWEE_NM = null;
            private string m_strJIKCHAK_NM = null;

            public string ORG_CD
            {
                get { return m_strORG_CD; }
                set { m_strORG_CD = value; }
            }
            
            public string JIKWEE_NM
            {
                get { return m_strJIKWEE_NM; }
                set { m_strJIKWEE_NM = value; }
            }
            
            public string JIKCHAK_NM
            {
                get { return m_strJIKCHAK_NM; }
                set { m_strJIKCHAK_NM = value; }
            }
        }

    }
}
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Models
{
    public class TemporaryMemberInfo
    {
        private int m_nMemberSerialNo = -1;
        private string m_strDisplaySOPName = "";
        private Temporary m_temporary = null;
        private Regular m_regular = null;
        private RegularMember m_regularMember = null;
        private int? m_nRole = null;

        public int MemberNo
        {
            get { return m_nMemberSerialNo; }
            set { m_nMemberSerialNo = value; }
        }

        public string DisplaySOPName
        {
            get { return m_strDisplaySOPName; }
            set { m_strDisplaySOPName = value; }
        }

        public Temporary Temporary
        {
            get { return m_temporary; }
            set { m_temporary = value; }
        }

        public Regular Regular
        {
            get { return m_regular; }
            set { m_regular = value; }
        }

        public RegularMember RegularMember
        {
            get { return m_regularMember; }
            set { m_regularMember = value; }
        }

        public bool IsNormal
        {
            get { return m_temporary == null ? false : m_temporary.nor_yn; }
            set
            {
                if (m_temporary != null)
                    m_temporary.nor_yn = value;
            }
        }

        public int? Role
        {
            get { return m_nRole; }
            set { m_nRole = value; }
        }

        public TemporaryMemberInfo()
        {
        }

        public TemporaryMemberInfo(TemporaryMember temporaryMember, Temporary temporary, Regular regular, RegularMember regularMember)
        {
            this.Temporary = temporary;
            this.Regular = regular;
            this.RegularMember = regularMember;

            this.MemberNo = temporaryMember.tmpr_memb_sn;
            this.DisplaySOPName = temporaryMember.disp_name;
            this.Role = temporaryMember.role_no;
            this.IsNormal = temporary.nor_yn;
        }
    }
}

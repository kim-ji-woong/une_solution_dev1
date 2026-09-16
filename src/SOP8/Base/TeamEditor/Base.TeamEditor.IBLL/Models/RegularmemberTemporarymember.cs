using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Models
{
    public class RegularmemberTemporarymember
    {
        public int TemporaryMemberNo { get; set; }
        public int TemporaryNo { get; set; }
        public string TemporaryName { get; set; }
        public int? Role { get; set; }
        public bool IsNormal { get; set; }
        public string DisplaySOPName { get; set; }
        public int? RegularNo { get; set; }
        public string RegularName { get; set; }
        public int? RegularMemberNo { get; set; }
        public string RegularMemberName { get; set; }

        public RegularmemberTemporarymember()
        {
        }

        public RegularmemberTemporarymember(TemporaryMember temporaryMember, Temporary temporary, Regular regular, RegularMember regularMember)
        {
            this.TemporaryMemberNo = temporaryMember.tmpr_memb_sn;
            this.TemporaryNo = temporary.tmpr_sn;
            this.TemporaryName = temporary.team_name;
            this.Role = temporaryMember.role_no;
            this.IsNormal = temporary.nor_yn;
            this.DisplaySOPName = temporaryMember.disp_name;

            if (regular == null)
            {
                this.RegularNo = null;
                this.RegularName = null;
            }
            else
            {
                this.RegularNo = regular.rgl_sn;
                this.RegularName = regular.team_name;
            }

            if (regularMember == null)
            {
                this.RegularMemberNo = null;
                this.RegularMemberName = null;
            }
            else
            {
                this.RegularMemberNo = regularMember.rgl_memb_sn;
                this.RegularMemberName = regularMember.memb_name;
            }
        }
    }
}

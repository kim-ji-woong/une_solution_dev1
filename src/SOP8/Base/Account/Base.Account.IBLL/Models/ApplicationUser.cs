using Base.Model.Account;

namespace Base.Account.IBLL.Models
{
    public class ApplicationUser
    {
        private int m_nNo = -1;
        private int m_nLevelNo = -1;
        private string m_strLevel = "";
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSessionKey = "";
        private object m_options = new object();
        private int? m_siteNo = null;
        private int? m_regularMemberNo = null;

        public int user_sn
        {
            get { return m_nNo; }
            set { m_nNo = value; }
        }

        public int grad_sn
        {
            get { return m_nLevelNo; }
            set { m_nLevelNo = value; }
        }

        public string grad_name
        {
            get { return m_strLevel; }
            set { m_strLevel = value; }
        }

        public string user_id
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string user_name
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public string session_key
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }

        public object Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public int? site_sn
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int? RegularMemberNo
        {
            get { return m_regularMemberNo; }
            set { m_regularMemberNo = value; }
        }

        public static ApplicationUser MakeUser(User user, Grade grade, string strSessionKey)
        {
            ApplicationUser appUser = new ApplicationUser();
            appUser.user_sn = user.user_sn;
            appUser.grad_sn = user.grad_sn;
            appUser.grad_name = grade.grad_name;
            appUser.user_id = user.user_id;
            appUser.user_name = user.user_name;
            appUser.session_key = strSessionKey;
            appUser.site_sn = user.site_sn;
            appUser.RegularMemberNo = user.rgl_memb_sn;

            return appUser;
        }
    }
}

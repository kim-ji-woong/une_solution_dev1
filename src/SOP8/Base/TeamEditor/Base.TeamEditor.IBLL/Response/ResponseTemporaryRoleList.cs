using System;
using System.Collections.Generic;
using Response;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseTemporaryRoleList : MessageResult
    {
        private List<RoleData> m_roleDatas = new List<RoleData>();

        public List<RoleData> RoleDatas
        {
            get { return m_roleDatas; }
            set { m_roleDatas = value; }
        }

        public ResponseTemporaryRoleList()
            : base()
        {
        }

        public ResponseTemporaryRoleList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class RoleData : IComparable
    {
        private int m_roleNo = -1;
        private string m_strRoleName = "";

        public int RoleNo
        {
            get { return m_roleNo; }
            set { m_roleNo = value; }
        }

        public string RoleName
        {
            get { return m_strRoleName; }
            set { m_strRoleName = value; }
        }

        public RoleData()
        {
        }

        public RoleData(int roleNo, string roleName)
        {
            m_roleNo = roleNo;
            m_strRoleName = roleName;
        }

        public int CompareTo(object obj)
        {
            RoleData roleData = (RoleData)obj;
            return this.m_roleNo.CompareTo(roleData.m_roleNo);
        }
    }
}

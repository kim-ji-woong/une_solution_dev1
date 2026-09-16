using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccessERP
{
    class AccessManager
    {
        private DataManager m_dataManager = null;
        private AccessERPManager m_parent = null;

        public AccessManager(AccessERPManager parent, DataManager dataManager)
        {
            m_parent = parent;
            m_dataManager = dataManager;
        }

        public List<ORG> GetOrgDatas(out string strErrMsg)
        {
            List<ORG> orgs = new List<ORG>();
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT OrgID, OrgName, ParentOrgID FROM View_Org");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    ORG org = new ORG();
                    org.OrgID = result.OrgID;
                    org.OrgName = result.OrgName;
                    org.ParentOrgID = result.ParentOrgID;

                    // 예외처리
                    if (org.ParentOrgID == org.OrgID)
                        org.ParentOrgID = null;

                    orgs.Add(org);
                }
            }
            catch (Exception e)
            {
                orgs = null;
                strErrMsg = "GetOrgDatas Error: " + e.Message;
            }

            return orgs;
        }

        public List<Person> GetPersonDatas(out List<string> levels, out string strErrMsg)
        {
            List<Person> people = new List<Person>();
            strErrMsg = null;
            levels = new List<string>();

            try
            {
                string strSQL = string.Format(@$"SELECT Sabun, Name, Tel, Mobile, OrgID, GradeName FROM View_Card_Person WHERE OrgID IS NOT NULL AND PersonType = 0");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    Person person = new Person();
                    person.Sabun = result.Sabun;
                    person.Name = result.Name;
                    person.Tel = result.Tel;
                    person.Mobile = result.Mobile;
                    person.OrgID = result.OrgID;
                    person.GradeName = result.GradeName;

                    if (person.Tel == "")
                        person.Tel = null;
                    if (person.Mobile == "")
                        person.Mobile = null;

                    if (levels.Contains(person.GradeName) == false)
                    {
                        levels.Add(person.GradeName);
                    }

                    people.Add(person);
                }
            }
            catch (Exception e)
            {
                people = null;
                strErrMsg = "GetPersonDatas Error: " + e.Message;
            }

            return people;
        }
    }

    public class ORG
    {
        public int OrgID { get; set; }
        public string OrgName { get; set; }
        public int? ParentOrgID { get; set; }
    }

    public class Person
    {
        public string Sabun { get; set; }
        public string Name { get; set; }
        public string Tel { get; set; }
        public string Mobile { get; set; }
        public int OrgID { get; set; }
        public string GradeName { get; set; }
    }
}

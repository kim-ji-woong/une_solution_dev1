using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;

namespace DapperSample.Model
{
    public class RegularMember : Table
    {
        public enum Fields { ID, RegularID, MemberName, PhoneNumber };
        public enum WriteFields { RegularID, MemberName, PhoneNumber };

        public int ID { get; set; }
        public int RegularID { get; set; }
        public string MemberName { get; set; }        
        public string PhoneNumber { get; set; }        

        public static string TableName = "SopTeamRegularMember";
        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }
    }
}

using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;

namespace DapperSample.Model
{
    public class NoIDTable : Table
    {
        public enum Fields { Test1, Test2 }
        public string Test1 { get; set; }
        public string Test2 { get; set; }

        public static string TableName = "NoIDTable";

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("Test1 = '{0}'", Test1);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }
    }
}

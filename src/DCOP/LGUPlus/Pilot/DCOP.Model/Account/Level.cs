using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Account
{
	public class Level : Table
	{
		public enum Fields { AccountLevelNo, AccountLevelName };
		public enum WriteFields { AccountLevelNo, AccountLevelName };

		public int AccountLevelNo { get; set; }
		public string AccountLevelName { get; set; }

		public static string TableName { get { return "AccountLevel"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.AccountLevelNo, AccountLevelNo);
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

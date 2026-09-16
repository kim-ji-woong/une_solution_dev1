using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Account
{
	public class Session : Table
	{
		public enum Fields { AccountUserNo, SessionKey, CreateTime, UpdateTime };
		public enum WriteFields { AccountUserNo, SessionKey, CreateTime, UpdateTime };

		public int AccountUserNo { get; set; }
		public string SessionKey { get; set; }
		public DateTime CreateTime { get; set; }
		public DateTime UpdateTime { get; set; }

		public static string TableName { get { return "AccountSession"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.AccountUserNo, AccountUserNo);
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

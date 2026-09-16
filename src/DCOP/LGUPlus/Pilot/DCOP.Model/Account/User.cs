using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Account
{
	public class User : Table
	{
		public enum Fields { AccountUserNo, AccountLevelNo, Password, UserID, NickName, PasswordCode, Salt };
		public enum WriteFields { AccountLevelNo, Password, UserID, NickName, PasswordCode, Salt };

		public int AccountUserNo { get; set; }
		public int AccountLevelNo { get; set; }
		public string Password { get; set; }
		public string UserID { get; set; }
		public string NickName { get; set; }
		public string PasswordCode { get; set; }
		public string Salt { get; set; }

		public static string TableName { get { return "AccountUser"; } }

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

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Account
{
	public class UserDataCenterLink : Table
	{
		public enum Fields { AccountUserNo, DataCenterNo };
		public enum WriteFields { AccountUserNo, DataCenterNo };

		public int AccountUserNo { get; set; }
		public int DataCenterNo { get; set; }

		public static string TableName { get { return "AccountUserDataCenterLink"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.AccountUserNo, AccountUserNo, Fields.DataCenterNo, DataCenterNo);
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

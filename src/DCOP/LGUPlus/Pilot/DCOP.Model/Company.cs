using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Company : Table
	{
		public enum Fields { CompanyNo, CompanyName, CompanyEngName };
		public enum WriteFields { CompanyNo, CompanyName, CompanyEngName };

		public int CompanyNo { get; set; }
		public string CompanyName { get; set; }
		public string CompanyEngName { get; set; }

		public static string TableName { get { return "Company"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.CompanyNo, CompanyNo);
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

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Site : Table
	{
		public enum Fields { SiteNo, SiteName };
		public enum WriteFields { SiteName };

		public int SiteNo { get; set; }
		public string SiteName { get; set; }

		public static string TableName { get { return "Site"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SiteNo, SiteNo);
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

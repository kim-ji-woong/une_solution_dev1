using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common
{
	public class Site : Table
	{
		public enum Fields { site_sn, site_name };
		public enum WriteFields { site_sn, site_name };

		public int site_sn { get; set; }
		public string site_name { get; set; }

		public static string TableName { get { return "co_site"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.site_sn, site_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Site obj)
		{
			this.site_sn = obj.site_sn;
			this.site_name = obj.site_name;
		}
	}
}

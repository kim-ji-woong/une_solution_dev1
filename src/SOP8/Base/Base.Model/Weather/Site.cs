using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Weather
{
	public class Site : Table
	{
		public enum Fields { wethr_site_sn, name, descp };
		public enum WriteFields { wethr_site_sn, name, descp };

		public int wethr_site_sn { get; set; }
		public string name { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "wt_site"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.wethr_site_sn, wethr_site_sn);
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
			this.wethr_site_sn = obj.wethr_site_sn;
			this.name = obj.name;
			this.descp = obj.descp;
		}
	}
}

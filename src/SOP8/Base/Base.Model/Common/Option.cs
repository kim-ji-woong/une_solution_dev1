using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common
{
	public class Option : Table
	{
		public enum Fields { optn_sn, prop_name, site_sn, prop_value, descp };
		public enum WriteFields { prop_name, site_sn, prop_value, descp };

		public int optn_sn { get; set; }
		public string prop_name { get; set; }
		public int? site_sn { get; set; }
		public string/* nullable */ prop_value { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "co_sys_optn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.optn_sn, optn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Option obj)
		{
			this.optn_sn = obj.optn_sn;
			this.prop_name = obj.prop_name;
			this.site_sn = obj.site_sn;
			this.prop_value = obj.prop_value;
			this.descp = obj.descp;
		}
	}
}

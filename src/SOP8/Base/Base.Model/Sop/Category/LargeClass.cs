using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class LargeClass : Table
	{
		public enum Fields { lclas_sn, lclas_name, site_sn };
		public enum WriteFields { lclas_name, site_sn };

		public int lclas_sn { get; set; }
		public string lclas_name { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "so_ctgry_lclas"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.lclas_sn, lclas_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(LargeClass obj)
		{
			this.lclas_sn = obj.lclas_sn;
			this.lclas_name = obj.lclas_name;
			this.site_sn = obj.site_sn;
		}
	}
}

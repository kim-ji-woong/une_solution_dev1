using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class MiddleClass : Table
	{
		public enum Fields { mclas_sn, lclas_sn, mclas_name };
		public enum WriteFields { lclas_sn, mclas_name };

		public int mclas_sn { get; set; }
		public int lclas_sn { get; set; }
		public string mclas_name { get; set; }

		public static string TableName { get { return "so_ctgry_mclas"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.mclas_sn, mclas_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(MiddleClass obj)
		{
			this.mclas_sn = obj.mclas_sn;
			this.lclas_sn = obj.lclas_sn;
			this.mclas_name = obj.mclas_name;
		}
	}
}

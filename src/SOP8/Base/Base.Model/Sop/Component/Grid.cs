using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Grid : Table
	{
		public enum Fields { grid_sn, step_memb_sn };
		public enum WriteFields { step_memb_sn };

		public int grid_sn { get; set; }
		public int step_memb_sn { get; set; }

		public static string TableName { get { return "so_compn_grd"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.grid_sn, grid_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Grid obj)
		{
			this.grid_sn = obj.grid_sn;
			this.step_memb_sn = obj.step_memb_sn;
		}
	}
}

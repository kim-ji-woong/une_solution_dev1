using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class GridRow : Table
	{
		public enum Fields { grid_sn, row_no, height };
		public enum WriteFields { grid_sn, row_no, height };

		public int grid_sn { get; set; }
		public int row_no { get; set; }
		public int height { get; set; }

		public static string TableName { get { return "so_compn_grid_row"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.grid_sn, grid_sn, Fields.row_no, row_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(GridRow obj)
		{
			this.grid_sn = obj.grid_sn;
			this.row_no = obj.row_no;
			this.height = obj.height;
		}
	}
}

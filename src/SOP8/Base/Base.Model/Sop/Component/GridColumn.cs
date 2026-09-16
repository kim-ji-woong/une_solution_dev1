using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class GridColumn : Table
	{
		public enum Fields { grid_sn, column_no, width };
		public enum WriteFields { grid_sn, column_no, width };

		public int grid_sn { get; set; }
		public int column_no { get; set; }
		public int width { get; set; }

		public static string TableName { get { return "so_compn_grid_column"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.grid_sn, grid_sn, Fields.column_no, column_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(GridColumn obj)
		{
			this.grid_sn = obj.grid_sn;
			this.column_no = obj.column_no;
			this.width = obj.width;
		}
	}
}

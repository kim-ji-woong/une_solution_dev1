using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Component : Table
	{
		public enum Fields { compn_sn, grid_sn, column_no, row_no, compn_optn_code, compn_code, step_memb_sn };
		public enum WriteFields { grid_sn, column_no, row_no, compn_optn_code, compn_code, step_memb_sn };

		public int compn_sn { get; set; }
		public int grid_sn { get; set; }
		public int column_no { get; set; }
		public int row_no { get; set; }
		public int compn_optn_code { get; set; }
		public int compn_code { get; set; }
		public int step_memb_sn { get; set; }

		public static string TableName { get { return "so_compn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.compn_sn, compn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Component obj)
		{
			this.compn_sn = obj.compn_sn;
			this.grid_sn = obj.grid_sn;
			this.column_no = obj.column_no;
			this.row_no = obj.row_no;
			this.compn_optn_code = obj.compn_optn_code;
			this.compn_code = obj.compn_code;
			this.step_memb_sn = obj.step_memb_sn;
		}
	}
}

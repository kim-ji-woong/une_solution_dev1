using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Arrow : Table
	{
		public enum Fields { arrw_sn, contents, lc_optn_code, begin_compn_sn, begin_arrw_lc_code, end_compn_sn, end_arrw_lc_code, step_memb_sn };
		public enum WriteFields { contents, lc_optn_code, begin_compn_sn, begin_arrw_lc_code, end_compn_sn, end_arrw_lc_code, step_memb_sn };

		public int arrw_sn { get; set; }
		public string/* nullable */ contents { get; set; }
		public int lc_optn_code { get; set; }
		public int begin_compn_sn { get; set; }
		public int begin_arrw_lc_code { get; set; }
		public int end_compn_sn { get; set; }
		public int end_arrw_lc_code { get; set; }
		public int step_memb_sn { get; set; }

		public static string TableName { get { return "so_compn_arrow"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.arrw_sn, arrw_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Arrow obj)
		{
			this.arrw_sn = obj.arrw_sn;
			this.contents = obj.contents;
			this.lc_optn_code = obj.lc_optn_code;
			this.begin_compn_sn = obj.begin_compn_sn;
			this.begin_arrw_lc_code = obj.begin_arrw_lc_code;
			this.end_compn_sn = obj.end_compn_sn;
			this.end_arrw_lc_code = obj.end_arrw_lc_code;
			this.step_memb_sn = obj.step_memb_sn;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class ComponentDetail : Table
	{
		public enum Fields { compn_hist_detail_sn, compn_hist_sn, data_no, data_intgr, data_float, data_str };
		public enum WriteFields { compn_hist_sn, data_no, data_intgr, data_float, data_str };

		public int compn_hist_detail_sn { get; set; }
		public int compn_hist_sn { get; set; }
		public int data_no { get; set; }
		public int? data_intgr { get; set; }
		public double? data_float { get; set; }
		public string/* nullable */ data_str { get; set; }

		public static string TableName { get { return "his_compn_detail"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.compn_hist_detail_sn, compn_hist_detail_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ComponentDetail obj)
		{
			this.compn_hist_detail_sn = obj.compn_hist_detail_sn;
			this.compn_hist_sn = obj.compn_hist_sn;
			this.data_no = obj.data_no;
			this.data_intgr = obj.data_intgr;
			this.data_float = obj.data_float;
			this.data_str = obj.data_str;
		}
	}
}

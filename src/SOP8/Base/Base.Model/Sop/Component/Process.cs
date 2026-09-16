using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Process : Table
	{
		public enum Fields { compn_sn, title, leadr_prvuse_yn, atmc_execut_yn, execut_no };
		public enum WriteFields { compn_sn, title, leadr_prvuse_yn, atmc_execut_yn, execut_no };

		public int compn_sn { get; set; }
		public string title { get; set; }
		public bool? leadr_prvuse_yn { get; set; }
		public bool atmc_execut_yn { get; set; }
		public int? execut_no { get; set; }

		public static string TableName { get { return "so_compn_procs"; } }

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

		public void FromCopy(Process obj)
		{
			this.compn_sn = obj.compn_sn;
			this.title = obj.title;
			this.leadr_prvuse_yn = obj.leadr_prvuse_yn;
			this.atmc_execut_yn = obj.atmc_execut_yn;
			this.execut_no = obj.execut_no;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class ProcessTemporary : Table
	{
		public enum Fields { compn_sn, tmpr_sn };
		public enum WriteFields { compn_sn, tmpr_sn };

		public int compn_sn { get; set; }
		public int tmpr_sn { get; set; }

		public static string TableName { get { return "so_compn_procs_tmpr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.compn_sn, compn_sn, Fields.tmpr_sn, tmpr_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ProcessTemporary obj)
		{
			this.compn_sn = obj.compn_sn;
			this.tmpr_sn = obj.tmpr_sn;
		}
	}
}

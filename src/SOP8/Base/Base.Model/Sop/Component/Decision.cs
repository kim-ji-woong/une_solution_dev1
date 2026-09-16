using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Decision : Table
	{
		public enum Fields { compn_sn, title, descp, atmc_execut_script, execut_no };
		public enum WriteFields { compn_sn, title, descp, atmc_execut_script, execut_no };

		public int compn_sn { get; set; }
		public string title { get; set; }
		public string/* nullable */ descp { get; set; }
		public string/* nullable */ atmc_execut_script { get; set; }
		public int? execut_no { get; set; }

		public static string TableName { get { return "so_compn_dcs"; } }

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

		public void FromCopy(Decision obj)
		{
			this.compn_sn = obj.compn_sn;
			this.title = obj.title;
			this.descp = obj.descp;
			this.atmc_execut_script = obj.atmc_execut_script;
			this.execut_no = obj.execut_no;
		}
	}
}

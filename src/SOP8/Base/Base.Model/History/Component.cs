using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class Component : Table
	{
		public enum Fields { compn_hist_sn, action_step_hist_sn, compn_sn, time, sop_sttus_optn_code, sop_sttus_code, compt_cnt, user_sn, descp };
		public enum WriteFields { action_step_hist_sn, compn_sn, time, sop_sttus_optn_code, sop_sttus_code, compt_cnt, user_sn, descp };

		public int compn_hist_sn { get; set; }
		public int action_step_hist_sn { get; set; }
		public int compn_sn { get; set; }
		public DateTime time { get; set; }
		public int sop_sttus_optn_code { get; set; }
		public int sop_sttus_code { get; set; }
		public int? compt_cnt { get; set; }
		public int? user_sn { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "his_compn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.compn_hist_sn, compn_hist_sn);
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
			this.compn_hist_sn = obj.compn_hist_sn;
			this.action_step_hist_sn = obj.action_step_hist_sn;
			this.compn_sn = obj.compn_sn;
			this.time = obj.time;
			this.sop_sttus_optn_code = obj.sop_sttus_optn_code;
			this.sop_sttus_code = obj.sop_sttus_code;
			this.compt_cnt = obj.compt_cnt;
			this.user_sn = obj.user_sn;
			this.descp = obj.descp;
		}
	}
}

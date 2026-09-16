using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class ActionStep : Table
	{
		public enum Fields { action_step_hist_sn, action_step_sn, begin_time, end_time, last_acces_time, detct_end_time, detct_time, lc, user_sn, sop_optn, sensor_zone_hist_sn, descp };
		public enum WriteFields { action_step_sn, begin_time, end_time, last_acces_time, detct_end_time, detct_time, lc, user_sn, sop_optn, sensor_zone_hist_sn, descp };

		public int action_step_hist_sn { get; set; }
		public int action_step_sn { get; set; }
		public DateTime begin_time { get; set; }
		public DateTime? end_time { get; set; }
		public DateTime? last_acces_time { get; set; }
		public DateTime? detct_end_time { get; set; }
		public DateTime? detct_time { get; set; }
		public string/* nullable */ lc { get; set; }
		public int? user_sn { get; set; }
		public string/* nullable */ sop_optn { get; set; }
		public int? sensor_zone_hist_sn { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "his_action_step"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.action_step_hist_sn, action_step_hist_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ActionStep obj)
		{
			this.action_step_hist_sn = obj.action_step_hist_sn;
			this.action_step_sn = obj.action_step_sn;
			this.begin_time = obj.begin_time;
			this.end_time = obj.end_time;
			this.last_acces_time = obj.last_acces_time;
			this.detct_end_time = obj.detct_end_time;
			this.detct_time = obj.detct_time;
			this.lc = obj.lc;
			this.user_sn = obj.user_sn;
			this.sop_optn = obj.sop_optn;
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.descp = obj.descp;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Alarm
{
	public class Current : Table
	{
		public enum Fields { sensor_zone_hist_sn, sensor_zone_sn, detct_ty_optn_code, detct_ty_code, alarm_tm, sop_sttus_optn_code, sop_sttus_code, alarm_level, user_sn };
		public enum WriteFields { sensor_zone_hist_sn, sensor_zone_sn, detct_ty_optn_code, detct_ty_code, alarm_tm, sop_sttus_optn_code, sop_sttus_code, alarm_level, user_sn };

		public int sensor_zone_hist_sn { get; set; }
		public int sensor_zone_sn { get; set; }
		public int detct_ty_optn_code { get; set; }
		public int detct_ty_code { get; set; }
		public DateTime alarm_tm { get; set; }
		public int sop_sttus_optn_code { get; set; }
		public int sop_sttus_code { get; set; }
		public int alarm_level { get; set; }
		public int? user_sn { get; set; }

		public static string TableName { get { return "al_cur"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.sensor_zone_hist_sn, sensor_zone_hist_sn, Fields.sensor_zone_sn, sensor_zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Current obj)
		{
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.detct_ty_optn_code = obj.detct_ty_optn_code;
			this.detct_ty_code = obj.detct_ty_code;
			this.alarm_tm = obj.alarm_tm;
			this.sop_sttus_optn_code = obj.sop_sttus_optn_code;
			this.sop_sttus_code = obj.sop_sttus_code;
			this.alarm_level = obj.alarm_level;
			this.user_sn = obj.user_sn;
		}
	}
}

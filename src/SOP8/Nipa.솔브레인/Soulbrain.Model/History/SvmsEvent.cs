using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.History
{
	public class SvmsEvent : Table
	{
		public enum Fields { event_sn, sensor_zone_sn, sensor_ty_code, alarm_yn, process_yn };
		public enum WriteFields { sensor_zone_sn, sensor_ty_code, alarm_yn, process_yn };

		public int event_sn { get; set; }
		public int sensor_zone_sn { get; set; }
		public int sensor_ty_code { get; set; }
		public bool alarm_yn { get; set; }
		public bool process_yn { get; set; }

		public static string TableName { get { return "his_svms_event"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.event_sn, event_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SvmsEvent obj)
		{
			this.event_sn = obj.event_sn;
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.alarm_yn = obj.alarm_yn;
			this.process_yn = obj.process_yn;
		}
	}
}

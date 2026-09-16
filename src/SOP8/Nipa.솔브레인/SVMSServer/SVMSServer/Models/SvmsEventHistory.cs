using System;

namespace SVMSServer.Models
{
	public class SvmsEventHistory
	{
		public enum Fields { event_sn, sensor_zone_sn, sensor_ty_code, alarm_yn, process_yn };

		public int event_sn { get; set; }
		public int sensor_zone_sn { get; set; }
		public int sensor_ty_code { get; set; }
		public bool alarm_yn { get; set; }
		public bool process_yn { get; set; }

		public static string TableName { get { return "his_svms_event"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}

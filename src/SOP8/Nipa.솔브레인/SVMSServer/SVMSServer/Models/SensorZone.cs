namespace SVMSServer.Models
{
	public class SensorZone
	{
		public enum Fields { sensor_zone_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, unq_key, eqp_zone_sn, alarm_yn, tag_no, acti, sensor_server_sn, descp };

		public int sensor_zone_sn { get; set; }
		public int sensor_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int? sensor_sub_ty_no { get; set; }
		public string unq_key { get; set; }
		public int? eqp_zone_sn { get; set; }
		public bool alarm_yn { get; set; }
		public int? tag_no { get; set; }
		public bool acti { get; set; }
		public int? sensor_server_sn { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "fa_sensor_zone"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.sensor_sub_ty_no ||
				field == Fields.eqp_zone_sn ||
				field == Fields.tag_no ||
				field == Fields.sensor_server_sn ||
				field == Fields.descp)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}

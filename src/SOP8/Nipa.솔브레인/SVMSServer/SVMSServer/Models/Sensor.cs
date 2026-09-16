namespace SVMSServer.Models
{
    public class Sensor
    {
		public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_name, lc_name, x, y, z, zone_sn, site_sn, sensor_sttus_optn_code, sensor_sttus_code, enab, deleted, manual_yn };

		public int sensor_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public string sensor_name { get; set; }
		public string/* nullable */ lc_name { get; set; }
		public double? x { get; set; }
		public double? y { get; set; }
		public double? z { get; set; }
		public int? zone_sn { get; set; }
		public int site_sn { get; set; }
		public int? sensor_sttus_optn_code { get; set; }
		public int? sensor_sttus_code { get; set; }
		public bool enab { get; set; }
		public bool deleted { get; set; }
		public bool manual_yn { get; set; }

		public static string TableName { get { return "fa_sensor"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.lc_name ||
				field == Fields.x ||
				field == Fields.y ||
				field == Fields.z ||
				field == Fields.zone_sn ||
				field == Fields.sensor_sttus_optn_code ||
				field == Fields.sensor_sttus_code)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}

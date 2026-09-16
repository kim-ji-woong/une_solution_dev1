namespace SVMSServer.Models
{
    public class SubType
    {
		public enum Fields { sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, sensor_sub_ty_name, uom, descp };

		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int sensor_sub_ty_no { get; set; }
		public string sensor_sub_ty_name { get; set; }
		public string/* nullable */ uom { get; set; }
		public string/* nullable */ descp { get; set; }

		public static string TableName { get { return "fa_sensor_sub_ty"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.uom ||
				field == Fields.descp)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}

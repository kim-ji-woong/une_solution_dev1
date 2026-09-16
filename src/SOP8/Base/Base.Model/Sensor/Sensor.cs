using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class Sensor : Table
	{
		public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_name, lc_name, x, y, z, zone_sn, site_sn, sensor_sttus_optn_code, sensor_sttus_code, enab, deleted, manual_yn };
		public enum WriteFields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_name, lc_name, x, y, z, zone_sn, site_sn, sensor_sttus_optn_code, sensor_sttus_code, enab, deleted, manual_yn };

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
		// 수동신고를 위한 센서인가?
		public bool manual_yn { get; set; }

		public static string TableName { get { return "fa_sensor"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3} and {4} = {5}", Fields.sensor_sn, sensor_sn, Fields.sensor_ty_optn_code, sensor_ty_optn_code, Fields.sensor_ty_code, sensor_ty_code);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Sensor obj)
		{
			this.sensor_sn = obj.sensor_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.sensor_name = obj.sensor_name;
			this.lc_name = obj.lc_name;
			this.x = obj.x;
			this.y = obj.y;
			this.z = obj.z;
			this.zone_sn = obj.zone_sn;
			this.site_sn = obj.site_sn;
			this.sensor_sttus_optn_code = obj.sensor_sttus_optn_code;
			this.sensor_sttus_code = obj.sensor_sttus_code;
			this.enab = obj.enab;
			this.deleted = obj.deleted;
			this.manual_yn = obj.manual_yn;
		}
	}
}

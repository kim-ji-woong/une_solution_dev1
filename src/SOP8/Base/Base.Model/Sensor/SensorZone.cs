using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class SensorZone : Table
	{
		public enum Fields { sensor_zone_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, unq_key, eqp_zone_sn, alarm_yn, tag_no, acti, sensor_server_sn, descp };
		public enum WriteFields { sensor_zone_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, unq_key, eqp_zone_sn, alarm_yn, tag_no, acti, sensor_server_sn, descp };

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

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sensor_zone_sn, sensor_zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SensorZone obj)
		{
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.sensor_sn = obj.sensor_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.sensor_sub_ty_no = obj.sensor_sub_ty_no;
			this.unq_key = obj.unq_key;
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.alarm_yn = obj.alarm_yn;
			this.tag_no = obj.tag_no;
			this.acti = obj.acti;
			this.sensor_server_sn = obj.sensor_server_sn;
			this.descp = obj.descp;
		}
	}
}

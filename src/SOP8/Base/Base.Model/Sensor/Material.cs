using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class Material : Table
	{
		public enum Fields { sensor_zone_sn, cur_data, lim_bas, sensor_lim_ty_optn_code, sensor_lim_ty };
		public enum WriteFields { sensor_zone_sn, cur_data, lim_bas, sensor_lim_ty_optn_code, sensor_lim_ty };

		public int sensor_zone_sn { get; set; }
		public string/* nullable */ cur_data { get; set; }
		public double? lim_bas { get; set; }
		public int? sensor_lim_ty_optn_code { get; set; }
		public int? sensor_lim_ty { get; set; }

		public static string TableName { get { return "fa_sensor_material"; } }

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

		public void FromCopy(Material obj)
		{
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.cur_data = obj.cur_data;
			this.lim_bas = obj.lim_bas;
			this.sensor_lim_ty_optn_code = obj.sensor_lim_ty_optn_code;
			this.sensor_lim_ty = obj.sensor_lim_ty;
		}
	}
}

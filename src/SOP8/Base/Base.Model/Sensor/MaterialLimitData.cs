using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class MaterialLimitData : Table
	{
		public enum Fields { sensor_zone_sn, lim_indx, usab, value };
		public enum WriteFields { sensor_zone_sn, lim_indx, usab, value };

		public int sensor_zone_sn { get; set; }
		public int lim_indx { get; set; }
		public bool usab { get; set; }
		public double? value { get; set; }

		public static string TableName { get { return "fa_sensor_material_lim_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.sensor_zone_sn, sensor_zone_sn, Fields.lim_indx, lim_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(MaterialLimitData obj)
		{
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.lim_indx = obj.lim_indx;
			this.usab = obj.usab;
			this.value = obj.value;
		}
	}
}

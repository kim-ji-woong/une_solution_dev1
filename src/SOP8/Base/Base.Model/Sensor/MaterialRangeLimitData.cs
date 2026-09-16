using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sensor
{
	public class MaterialRangeLimitData : Table
	{
		public enum Fields { sensor_zone_sn, lim_indx, range_indx, usab, min, max };
		public enum WriteFields { sensor_zone_sn, lim_indx, range_indx, usab, min, max };

		public int sensor_zone_sn { get; set; }
		public int lim_indx { get; set; }
		public int range_indx { get; set; }
		public bool? usab { get; set; }
		public double min { get; set; }
		public double max { get; set; }

		public static string TableName { get { return "fa_sensor_material_range_lim_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3} and {4} = {5}", Fields.sensor_zone_sn, sensor_zone_sn, Fields.lim_indx, lim_indx, Fields.range_indx, range_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(MaterialRangeLimitData obj)
		{
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.lim_indx = obj.lim_indx;
			this.range_indx = obj.range_indx;
			this.usab = obj.usab;
			this.min = obj.min;
			this.max = obj.max;
		}
	}
}

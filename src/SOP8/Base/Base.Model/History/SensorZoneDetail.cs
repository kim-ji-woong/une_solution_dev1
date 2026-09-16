using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class SensorZoneDetail : Table, IComparable
	{
		public enum Fields { sensor_zone_hist_sn, sensor_zone_sn, tm };
		public enum WriteFields { sensor_zone_hist_sn, sensor_zone_sn, tm };

		public int sensor_zone_hist_sn { get; set; }
		public int sensor_zone_sn { get; set; }
		public DateTime? tm { get; set; }

		public static string TableName { get { return "his_sensor_zone_detail"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.sensor_zone_hist_sn, sensor_zone_hist_sn, Fields.sensor_zone_sn, sensor_zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SensorZoneDetail obj)
		{
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.tm = obj.tm;
		}

		public int CompareTo(object obj)
		{
			SensorZoneDetail history1 = this;
			SensorZoneDetail history2 = (SensorZoneDetail)obj;

			if (history1.sensor_zone_hist_sn < history2.sensor_zone_hist_sn)
				return -1;
			else if (history1.sensor_zone_hist_sn > history2.sensor_zone_hist_sn)
				return 1;
			else
            {
				if (history1.tm != null && history2.tm == null)
					return -1;
				else if (history1.tm == null && history2.tm != null)
					return 1;
				else if (history1.tm != null && history2.tm != null)
                {
					if (history1.tm < history2.tm)
						return -1;
					else if (history1.tm > history2.tm)
						return 1;
                }
			}

			return 0;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class SensorReaction : Table, IComparable
	{
		public enum Fields { sensor_react_hist_sn, sensor_zone_hist_sn, react_ty_optn_code, react_ty_code, tm, mssage, zone_sn, eqp_zone_sn, sensor_zone_sn, sensor_value, user_sn, alarm_level };
		public enum WriteFields { sensor_zone_hist_sn, react_ty_optn_code, react_ty_code, tm, mssage, zone_sn, eqp_zone_sn, sensor_zone_sn, sensor_value, user_sn, alarm_level };

		public int sensor_react_hist_sn { get; set; }
		public int sensor_zone_hist_sn { get; set; }
		public int react_ty_optn_code { get; set; }
		public int react_ty_code { get; set; }
		public DateTime tm { get; set; }
		public string/* nullable */ mssage { get; set; }
		public int? zone_sn { get; set; }
		public int? eqp_zone_sn { get; set; }
		public int? sensor_zone_sn { get; set; }
		public string/* nullable */ sensor_value { get; set; }
		public int? user_sn { get; set; }
		public int? alarm_level { get; set; }

		public static string TableName { get { return "his_sensor_react"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sensor_react_hist_sn, sensor_react_hist_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SensorReaction obj)
		{
			this.sensor_react_hist_sn = obj.sensor_react_hist_sn;
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.react_ty_optn_code = obj.react_ty_optn_code;
			this.react_ty_code = obj.react_ty_code;
			this.tm = obj.tm;
			this.mssage = obj.mssage;
			this.zone_sn = obj.zone_sn;
			this.eqp_zone_sn = obj.eqp_zone_sn;
			this.sensor_zone_sn = obj.sensor_zone_sn;
			this.sensor_value = obj.sensor_value;
			this.user_sn = obj.user_sn;
			this.alarm_level = obj.alarm_level;
		}

		public int CompareTo(object obj)
		{
			SensorReaction history1 = this;
			SensorReaction history2 = (SensorReaction)obj;

			if (history1.sensor_react_hist_sn < history2.sensor_react_hist_sn)
				return -1;
			else if (history1.sensor_react_hist_sn > history2.sensor_react_hist_sn)
				return 1;
			return 0;
		}
	}
}

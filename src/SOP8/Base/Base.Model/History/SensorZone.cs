using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class SensorZone : Table, IComparable
	{
		public enum Fields { sensor_zone_hist_sn, tm, zone_sn, sensor_ty_optn_code, sensor_ty_code, detct_sttus_optn_code, detct_sttus_code, memo, site_sn, reportr };
		public enum WriteFields { tm, zone_sn, sensor_ty_optn_code, sensor_ty_code, detct_sttus_optn_code, detct_sttus_code, memo, site_sn, reportr };

		public int sensor_zone_hist_sn { get; set; }
		public DateTime tm { get; set; }
		public int? zone_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int? detct_sttus_optn_code { get; set; }
		public int? detct_sttus_code { get; set; }
		public string/* nullable */ memo { get; set; }
		public int site_sn { get; set; }
		public string/* nullable */ reportr { get; set; }

		public static string TableName { get { return "his_sensor_zone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.sensor_zone_hist_sn, sensor_zone_hist_sn);
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
			this.sensor_zone_hist_sn = obj.sensor_zone_hist_sn;
			this.tm = obj.tm;
			this.zone_sn = obj.zone_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.detct_sttus_optn_code = obj.detct_sttus_optn_code;
			this.detct_sttus_code = obj.detct_sttus_code;
			this.memo = obj.memo;
			this.site_sn = obj.site_sn;
			this.reportr = obj.reportr;
		}

		public int CompareTo(object obj)
		{
			SensorZone history1 = this;
			SensorZone history2 = (SensorZone)obj;

			if (history1.sensor_zone_hist_sn < history2.sensor_zone_hist_sn)
				return -1;
			else if (history1.sensor_zone_hist_sn > history2.sensor_zone_hist_sn)
				return 1;
			return 0;
		}
	}
}

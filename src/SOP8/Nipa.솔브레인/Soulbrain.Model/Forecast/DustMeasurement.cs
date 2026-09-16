using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Forecast
{
	public class DustMeasurement : Table
	{
		public enum Fields { tm, dust_msrr_sn, ulfptc_value, fptc_value, co2_value, vlnms_value };
		public enum WriteFields { tm, dust_msrr_sn, ulfptc_value, fptc_value, co2_value, vlnms_value };

		public DateTime tm { get; set; }
		public int dust_msrr_sn { get; set; }
		public double ulfptc_value { get; set; }
		public double fptc_value { get; set; }
		public double co2_value { get; set; }
		public double vlnms_value { get; set; }

		public static string TableName { get { return "fcst_dust_msrr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(DustMeasurement obj)
		{
			this.tm = obj.tm;
			this.dust_msrr_sn = obj.dust_msrr_sn;
			this.ulfptc_value = obj.ulfptc_value;
			this.fptc_value = obj.fptc_value;
			this.co2_value = obj.co2_value;
			this.vlnms_value = obj.vlnms_value;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.History
{
	public class DustMeasurement : Table
	{
		public enum Fields { hist_sn, dust_msrr_sn, vlnms_value, co2_value , ulfptc_value, fptc_value, exrfn_opr_yn, tm };
		public enum WriteFields { dust_msrr_sn, vlnms_value, co2_value , ulfptc_value, fptc_value, exrfn_opr_yn, tm };

		public int hist_sn { get; set; }
		public int dust_msrr_sn { get; set; }
		public double? vlnms_value { get; set; }
		public double? co2_value  { get; set; }
		public double? ulfptc_value { get; set; }
		public double? fptc_value { get; set; }
		public bool? exrfn_opr_yn { get; set; }
		public DateTime tm { get; set; }

		public static string TableName { get { return "his_dust_msrr_data"; } }

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
			this.hist_sn = obj.hist_sn;
			this.dust_msrr_sn = obj.dust_msrr_sn;
			this.vlnms_value = obj.vlnms_value;
			this.co2_value  = obj.co2_value ;
			this.ulfptc_value = obj.ulfptc_value;
			this.fptc_value = obj.fptc_value;
			this.exrfn_opr_yn = obj.exrfn_opr_yn;
			this.tm = obj.tm;
		}
	}
}

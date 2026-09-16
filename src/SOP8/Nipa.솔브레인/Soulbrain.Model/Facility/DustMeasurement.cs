using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
	public class DustMeasurement : Table
	{
		public enum Fields { dust_msrr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, msrr_lc_sn, exrfn_opr_yn, fptc_value, ulfptc_value, co2_value, vlnms_value };
		public enum WriteFields { dust_msrr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, msrr_lc_sn, exrfn_opr_yn, fptc_value, ulfptc_value, co2_value, vlnms_value};

		public int dust_msrr_sn { get; set; }
		public int sensor_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public int msrr_lc_sn { get; set; }
		public bool? exrfn_opr_yn { get; set; }
		public double? fptc_value { get; set; }
		public double? ulfptc_value { get; set; }
		public double? co2_value { get; set; }
		public double? vlnms_value { get; set; }

		public static string TableName { get { return "fa_dust_msrr"; } }

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
			this.dust_msrr_sn = obj.dust_msrr_sn;
			this.sensor_sn = obj.sensor_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.msrr_lc_sn = obj.msrr_lc_sn;
			this.exrfn_opr_yn = obj.exrfn_opr_yn;
			this.fptc_value = obj.fptc_value;
			this.ulfptc_value = obj.ulfptc_value;
			this.co2_value = obj.co2_value;
			this.vlnms_value = obj.vlnms_value;
		}
	}
}

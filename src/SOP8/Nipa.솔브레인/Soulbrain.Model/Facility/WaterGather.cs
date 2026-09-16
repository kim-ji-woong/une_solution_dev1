using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
	public class WaterGather : Table
	{
		public enum Fields { wgr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, flugt_opn_rate, hydro_ion_dnsty_idex };
		public enum WriteFields { wgr_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, flugt_opn_rate, hydro_ion_dnsty_idex };

		public int wgr_sn { get; set; }
		public int sensor_sn { get; set; }
		public int sensor_ty_optn_code { get; set; }
		public int sensor_ty_code { get; set; }
		public double? flugt_opn_rate { get; set; }
		public double? hydro_ion_dnsty_idex { get; set; }

		public static string TableName { get { return "fa_wgr"; } }

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

		public void FromCopy(WaterGather obj)
		{
			this.wgr_sn = obj.wgr_sn;
			this.sensor_sn = obj.sensor_sn;
			this.sensor_ty_optn_code = obj.sensor_ty_optn_code;
			this.sensor_ty_code = obj.sensor_ty_code;
			this.flugt_opn_rate = obj.flugt_opn_rate;
			this.hydro_ion_dnsty_idex = obj.hydro_ion_dnsty_idex;
		}
	}
}

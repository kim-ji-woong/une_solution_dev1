using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.History
{
	public class WaterGather : Table
	{
		public enum Fields { hist_sn, wgr_sn, flugt_opn_rate, hydro_ion_dnsty_idex, tm };
		public enum WriteFields { wgr_sn, flugt_opn_rate, hydro_ion_dnsty_idex, tm };

		public int hist_sn { get; set; }
		public int wgr_sn { get; set; }
		public double flugt_opn_rate { get; set; }
		public double hydro_ion_dnsty_idex { get; set; }
		public DateTime tm { get; set; }

		public static string TableName { get { return "his_wgr_data"; } }

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
			this.hist_sn = obj.hist_sn;
			this.wgr_sn = obj.wgr_sn;
			this.flugt_opn_rate = obj.flugt_opn_rate;
			this.hydro_ion_dnsty_idex = obj.hydro_ion_dnsty_idex;
			this.tm = obj.tm;
		}
	}
}

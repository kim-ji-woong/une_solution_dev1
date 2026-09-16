using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Forecast
{
	public class WaterGather : Table
	{
		public enum Fields { tm, wgr_sn, hydro_ion_dnsty_idex };
		public enum WriteFields { tm, wgr_sn, hydro_ion_dnsty_idex };

		public DateTime tm { get; set; }
		public int wgr_sn { get; set; }
		public double hydro_ion_dnsty_idex { get; set; }

		public static string TableName { get { return "fcst_wgr"; } }

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
			this.tm = obj.tm;
			this.wgr_sn = obj.wgr_sn;
			this.hydro_ion_dnsty_idex = obj.hydro_ion_dnsty_idex;
		}
	}
}

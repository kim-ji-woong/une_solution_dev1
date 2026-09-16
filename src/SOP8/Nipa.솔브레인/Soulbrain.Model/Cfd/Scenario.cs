using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Cfd
{
    public class Scenario : Table
	{
		public enum Fields { senario_sn, mttr_sn, trgt_lc, buld_sn, wind_drc, wind_spd };
		public enum WriteFields { senario_sn, mttr_sn, trgt_lc, buld_sn, wind_drc, wind_spd };

		public int senario_sn { get; set; }
		public int mttr_sn { get; set; }
		public string trgt_lc { get; set; }
		public int buld_sn { get; set; }
		public int? wind_drc { get; set; }
		public double? wind_spd { get; set; }

		public static string TableName { get { return "cfd_senario"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.senario_sn, senario_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Scenario obj)
		{
			this.senario_sn = obj.senario_sn;
			this.mttr_sn = obj.mttr_sn;
			this.trgt_lc = obj.trgt_lc;
			this.buld_sn = obj.buld_sn;
			this.wind_drc = obj.wind_drc;
			this.wind_spd = obj.wind_spd;
		}
	}
}

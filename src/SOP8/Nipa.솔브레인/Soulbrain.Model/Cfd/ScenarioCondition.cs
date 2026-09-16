using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Cfd
{
	public class ScenarioCondition : Table
	{
		public enum Fields { mttr_sn, trgt_lc, buld_sn, lkg_hol, lkg_tm, all_lkg_value, air_inhl_rate };
		public enum WriteFields { mttr_sn, trgt_lc, buld_sn, lkg_hol, lkg_tm, all_lkg_value, air_inhl_rate };

		public int mttr_sn { get; set; }
		public string trgt_lc { get; set; }
		public int buld_sn { get; set; }
		public int lkg_hol { get; set; }
		public int lkg_tm { get; set; }
		public double all_lkg_value { get; set; }
		public double air_inhl_rate { get; set; }

		public static string TableName { get { return "cfd_senario_cnd"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = '{3}' and {4} = {5}", Fields.mttr_sn, mttr_sn, Fields.trgt_lc, trgt_lc, Fields.buld_sn, buld_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ScenarioCondition obj)
		{
			this.mttr_sn = obj.mttr_sn;
			this.trgt_lc = obj.trgt_lc;
			this.buld_sn = obj.buld_sn;
			this.lkg_hol = obj.lkg_hol;
			this.lkg_tm = obj.lkg_tm;
			this.all_lkg_value = obj.all_lkg_value;
			this.air_inhl_rate = obj.air_inhl_rate;
		}
	}
}

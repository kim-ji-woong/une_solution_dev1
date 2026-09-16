using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Weather
{
	public class Weekly : Table
	{
		public enum Fields { wethr_site_sn, wethr_sttus_optn_code, oneday_after_tp, oneday_after_min_tp, oneday_after_wethr_sttus_code, twoday_after_tp, twoday_after_min_tp, twoday_after_wethr_sttus_code, thrday_after_tp, thrday_after_min_tp, thrday_after_wethr_sttus_code, fourday_after_tp, fourday_after_min_tp, fourday_after_wethr_sttus_code, fiveday_after_tp, fiveday_after_min_tp, fiveday_after_wethr_sttus_code, sixday_after_tp, sixday_after_min_tp, sixday_after_wethr_sttus_code, updt_tm };
		public enum WriteFields { wethr_site_sn, wethr_sttus_optn_code, oneday_after_tp, oneday_after_min_tp, oneday_after_wethr_sttus_code, twoday_after_tp, twoday_after_min_tp, twoday_after_wethr_sttus_code, thrday_after_tp, thrday_after_min_tp, thrday_after_wethr_sttus_code, fourday_after_tp, fourday_after_min_tp, fourday_after_wethr_sttus_code, fiveday_after_tp, fiveday_after_min_tp, fiveday_after_wethr_sttus_code, sixday_after_tp, sixday_after_min_tp, sixday_after_wethr_sttus_code, updt_tm };

		public int wethr_site_sn { get; set; }
		public int wethr_sttus_optn_code { get; set; }
		public double oneday_after_tp { get; set; }
		public double oneday_after_min_tp { get; set; }
		public int oneday_after_wethr_sttus_code { get; set; }
		public double twoday_after_tp { get; set; }
		public double twoday_after_min_tp { get; set; }
		public int twoday_after_wethr_sttus_code { get; set; }
		public double thrday_after_tp { get; set; }
		public double thrday_after_min_tp { get; set; }
		public int thrday_after_wethr_sttus_code { get; set; }
		public double fourday_after_tp { get; set; }
		public double fourday_after_min_tp { get; set; }
		public int fourday_after_wethr_sttus_code { get; set; }
		public double fiveday_after_tp { get; set; }
		public double fiveday_after_min_tp { get; set; }
		public int fiveday_after_wethr_sttus_code { get; set; }
		public double sixday_after_tp { get; set; }
		public double sixday_after_min_tp { get; set; }
		public int sixday_after_wethr_sttus_code { get; set; }
		public DateTime updt_tm { get; set; }

		public static string TableName { get { return "wt_wkly"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.wethr_site_sn, wethr_site_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Weekly obj)
		{
			this.wethr_site_sn = obj.wethr_site_sn;
			this.wethr_sttus_optn_code = obj.wethr_sttus_optn_code;
			this.oneday_after_tp = obj.oneday_after_tp;
			this.oneday_after_min_tp = obj.oneday_after_min_tp;
			this.oneday_after_wethr_sttus_code = obj.oneday_after_wethr_sttus_code;
			this.twoday_after_tp = obj.twoday_after_tp;
			this.twoday_after_min_tp = obj.twoday_after_min_tp;
			this.twoday_after_wethr_sttus_code = obj.twoday_after_wethr_sttus_code;
			this.thrday_after_tp = obj.thrday_after_tp;
			this.thrday_after_min_tp = obj.thrday_after_min_tp;
			this.thrday_after_wethr_sttus_code = obj.thrday_after_wethr_sttus_code;
			this.fourday_after_tp = obj.fourday_after_tp;
			this.fourday_after_min_tp = obj.fourday_after_min_tp;
			this.fourday_after_wethr_sttus_code = obj.fourday_after_wethr_sttus_code;
			this.fiveday_after_tp = obj.fiveday_after_tp;
			this.fiveday_after_min_tp = obj.fiveday_after_min_tp;
			this.fiveday_after_wethr_sttus_code = obj.fiveday_after_wethr_sttus_code;
			this.sixday_after_tp = obj.sixday_after_tp;
			this.sixday_after_min_tp = obj.sixday_after_min_tp;
			this.sixday_after_wethr_sttus_code = obj.sixday_after_wethr_sttus_code;
			this.updt_tm = obj.updt_tm;
		}
	}
}

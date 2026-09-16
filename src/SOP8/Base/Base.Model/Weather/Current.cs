using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Weather
{
	public class Current : Table
	{
		public enum Fields { wethr_site_sn, tp, sensb_tp, rain, hd, wind_spd, atm, updt_tm, wethr_sttus_optn_code, wethr_sttus_code, wind_drc_optn_code, wind_drc_code };
		public enum WriteFields { wethr_site_sn, tp, sensb_tp, rain, hd, wind_spd, atm, updt_tm, wethr_sttus_optn_code, wethr_sttus_code, wind_drc_optn_code, wind_drc_code };

		public int wethr_site_sn { get; set; }
		public double tp { get; set; }
		public double? sensb_tp { get; set; }
		public double rain { get; set; }
		public double hd { get; set; }
		public double? wind_spd { get; set; }
		public double? atm { get; set; }
		public DateTime updt_tm { get; set; }
		public int? wethr_sttus_optn_code { get; set; }
		public int? wethr_sttus_code { get; set; }
		public int? wind_drc_optn_code { get; set; }
		public int? wind_drc_code { get; set; }

		public static string TableName { get { return "wt_cur"; } }

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

		public void FromCopy(Current obj)
		{
			this.wethr_site_sn = obj.wethr_site_sn;
			this.tp = obj.tp;
			this.sensb_tp = obj.sensb_tp;
			this.rain = obj.rain;
			this.hd = obj.hd;
			this.wind_spd = obj.wind_spd;
			this.atm = obj.atm;
			this.updt_tm = obj.updt_tm;
			this.wethr_sttus_optn_code = obj.wethr_sttus_optn_code;
			this.wethr_sttus_code = obj.wethr_sttus_code;
			this.wind_drc_optn_code = obj.wind_drc_optn_code;
			this.wind_drc_code = obj.wind_drc_code;
		}
	}
}

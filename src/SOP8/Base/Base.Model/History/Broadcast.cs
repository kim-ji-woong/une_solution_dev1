using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.History
{
	public class Broadcast : Table
	{
		public enum Fields { brdcst_hist_sn, text, siren_yn, brdcst_sttus_optn_code, brdcst_sttus_code, repit_cnt, requst_time, execut_time, site_sn };
		public enum WriteFields { text, siren_yn, brdcst_sttus_optn_code, brdcst_sttus_code, repit_cnt, requst_time, execut_time, site_sn };

		public int brdcst_hist_sn { get; set; }
		public string text { get; set; }
		public bool siren_yn { get; set; }
		public int brdcst_sttus_optn_code { get; set; }
		public int brdcst_sttus_code { get; set; }
		public int repit_cnt { get; set; }
		public DateTime requst_time { get; set; }
		public DateTime execut_time { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "his_brdcst"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.brdcst_hist_sn, brdcst_hist_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Broadcast obj)
		{
			this.brdcst_hist_sn = obj.brdcst_hist_sn;
			this.text = obj.text;
			this.siren_yn = obj.siren_yn;
			this.brdcst_sttus_optn_code = obj.brdcst_sttus_optn_code;
			this.brdcst_sttus_code = obj.brdcst_sttus_code;
			this.repit_cnt = obj.repit_cnt;
			this.requst_time = obj.requst_time;
			this.execut_time = obj.execut_time;
			this.site_sn = obj.site_sn;
		}
	}
}

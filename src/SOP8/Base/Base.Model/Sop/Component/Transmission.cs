using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Transmission : Table
	{
		public enum Fields { compn_sn, title, sms_yn, email_yn, brdcst_yn, mssage, leadr_prvuse_yn, atmc_execut_yn, siren_yn, execut_no };
		public enum WriteFields { compn_sn, title, sms_yn, email_yn, brdcst_yn, mssage, leadr_prvuse_yn, atmc_execut_yn, siren_yn, execut_no };

		public int compn_sn { get; set; }
		public string title { get; set; }
		public bool sms_yn { get; set; }
		public bool email_yn { get; set; }
		public bool brdcst_yn { get; set; }
		public string mssage { get; set; }
		public bool? leadr_prvuse_yn { get; set; }
		public bool atmc_execut_yn { get; set; }
		public bool? siren_yn { get; set; }
		public int? execut_no { get; set; }

		public static string TableName { get { return "so_compn_trnsmis"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.compn_sn, compn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Transmission obj)
		{
			this.compn_sn = obj.compn_sn;
			this.title = obj.title;
			this.sms_yn = obj.sms_yn;
			this.email_yn = obj.email_yn;
			this.brdcst_yn = obj.brdcst_yn;
			this.mssage = obj.mssage;
			this.leadr_prvuse_yn = obj.leadr_prvuse_yn;
			this.atmc_execut_yn = obj.atmc_execut_yn;
			this.siren_yn = obj.siren_yn;
			this.execut_no = obj.execut_no;
		}
	}
}

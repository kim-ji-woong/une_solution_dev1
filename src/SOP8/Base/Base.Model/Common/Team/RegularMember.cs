using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common.Team
{
	public class RegularMember : Table
	{
		public enum Fields { rgl_memb_sn, rgl_sn, memb_name, unq_key, offm_telno, telno, email, clsf_optn_no, clsf_no, ofcps_optn_no, ofcps_no, dty_sttus_optn_no, dty_sttus_no, memo };
		public enum WriteFields { rgl_sn, memb_name, unq_key, offm_telno, telno, email, clsf_optn_no, clsf_no, ofcps_optn_no, ofcps_no, dty_sttus_optn_no, dty_sttus_no, memo };

		public int rgl_memb_sn { get; set; }
		public int rgl_sn { get; set; }
		public string memb_name { get; set; }
		public string/* nullable */ unq_key { get; set; }
		public string/* nullable */ offm_telno { get; set; }
		public string/* nullable */ telno { get; set; }
		public string/* nullable */ email { get; set; }
		public int? clsf_optn_no { get; set; }
		public int? clsf_no { get; set; }
		public int? ofcps_optn_no { get; set; }
		public int? ofcps_no { get; set; }
		public int? dty_sttus_optn_no { get; set; }
		public int? dty_sttus_no { get; set; }
		public string/* nullable */ memo { get; set; }

		public static string TableName { get { return "co_team_rgl_memb"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.rgl_memb_sn, rgl_memb_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(RegularMember obj)
		{
			this.rgl_memb_sn = obj.rgl_memb_sn;
			this.rgl_sn = obj.rgl_sn;
			this.memb_name = obj.memb_name;
			this.unq_key = obj.unq_key;
			this.offm_telno = obj.offm_telno;
			this.telno = obj.telno;
			this.email = obj.email;
			this.clsf_optn_no = obj.clsf_optn_no;
			this.clsf_no = obj.clsf_no;
			this.ofcps_optn_no = obj.ofcps_optn_no;
			this.ofcps_no = obj.ofcps_no;
			this.dty_sttus_optn_no = obj.dty_sttus_optn_no;
			this.dty_sttus_no = obj.dty_sttus_no;
			this.memo = obj.memo;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common.Team
{
	public class TemporaryMember : Table
	{
		public enum Fields { tmpr_memb_sn, disp_name, tmpr_sn, rgl_sn, rgl_memb_sn, role_optn_no, role_no, memo };
		public enum WriteFields { disp_name, tmpr_sn, rgl_sn, rgl_memb_sn, role_optn_no, role_no, memo };

		public int tmpr_memb_sn { get; set; }
		public string/* nullable */ disp_name { get; set; }
		public int tmpr_sn { get; set; }
		public int? rgl_sn { get; set; }
		public int? rgl_memb_sn { get; set; }
		public int? role_optn_no { get; set; }
		public int? role_no { get; set; }
		public string/* nullable */ memo { get; set; }

		public static string TableName { get { return "co_team_tmpr_memb"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.tmpr_memb_sn, tmpr_memb_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(TemporaryMember obj)
		{
			this.tmpr_memb_sn = obj.tmpr_memb_sn;
			this.disp_name = obj.disp_name;
			this.tmpr_sn = obj.tmpr_sn;
			this.rgl_sn = obj.rgl_sn;
			this.rgl_memb_sn = obj.rgl_memb_sn;
			this.role_optn_no = obj.role_optn_no;
			this.role_no = obj.role_no;
			this.memo = obj.memo;
		}
	}
}

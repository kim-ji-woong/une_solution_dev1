using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common.Team
{
	public class Temporary : Table
	{
		public enum Fields { tmpr_sn, parnts_sn, team_name, nor_yn, site_sn };
		public enum WriteFields { parnts_sn, team_name, nor_yn, site_sn };

		public int tmpr_sn { get; set; }
		public int? parnts_sn { get; set; }
		public string team_name { get; set; }
		public bool nor_yn { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "co_team_tmpr"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.tmpr_sn, tmpr_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Temporary obj)
		{
			this.tmpr_sn = obj.tmpr_sn;
			this.parnts_sn = obj.parnts_sn;
			this.team_name = obj.team_name;
			this.nor_yn = obj.nor_yn;
			this.site_sn = obj.site_sn;
		}
	}
}

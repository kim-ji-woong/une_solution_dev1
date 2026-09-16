using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common.Team
{
	public class Regular : Table
	{
		public enum Fields { rgl_sn, team_name, parnts_sn, site_sn };
		public enum WriteFields { team_name, parnts_sn, site_sn };

		public int rgl_sn { get; set; }
		public string team_name { get; set; }
		public int? parnts_sn { get; set; }
		public int? site_sn { get; set; }

		public static string TableName { get { return "co_team_rgl"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.rgl_sn, rgl_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Regular obj)
		{
			this.rgl_sn = obj.rgl_sn;
			this.team_name = obj.team_name;
			this.parnts_sn = obj.parnts_sn;
			this.site_sn = obj.site_sn;
		}
	}
}

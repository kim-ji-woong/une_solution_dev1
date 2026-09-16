using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Common.Team
{
	public class Option : Table
	{
		public enum Fields { team_optn_ty_no, team_optn_no, team_optn_name };
		public enum WriteFields { team_optn_ty_no, team_optn_no, team_optn_name };

		public int team_optn_ty_no { get; set; }
		public int team_optn_no { get; set; }
		public string team_optn_name { get; set; }

		public static string TableName { get { return "co_team_optn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.team_optn_ty_no, team_optn_ty_no, Fields.team_optn_no, team_optn_no);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Option obj)
		{
			this.team_optn_ty_no = obj.team_optn_ty_no;
			this.team_optn_no = obj.team_optn_no;
			this.team_optn_name = obj.team_optn_name;
		}
	}
}

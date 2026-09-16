using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Category
{
	public class ActionStep : Table
	{
		public enum Fields { action_step_sn, action_step_name, sclas_sn };
		public enum WriteFields { action_step_name, sclas_sn };

		public int action_step_sn { get; set; }
		public string action_step_name { get; set; }
		public int sclas_sn { get; set; }

		public static string TableName { get { return "so_ctgry_action_step"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.action_step_sn, action_step_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ActionStep obj)
		{
			this.action_step_sn = obj.action_step_sn;
			this.action_step_name = obj.action_step_name;
			this.sclas_sn = obj.sclas_sn;
		}
	}
}

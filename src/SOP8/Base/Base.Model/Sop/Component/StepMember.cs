using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class StepMember : Table
	{
		public enum Fields { step_memb_sn, action_step_sn };
		public enum WriteFields { action_step_sn };

		public int step_memb_sn { get; set; }
		public int action_step_sn { get; set; }

		public static string TableName { get { return "so_compn_step_memb"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.step_memb_sn, step_memb_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(StepMember obj)
		{
			this.step_memb_sn = obj.step_memb_sn;
			this.action_step_sn = obj.action_step_sn;
		}
	}
}

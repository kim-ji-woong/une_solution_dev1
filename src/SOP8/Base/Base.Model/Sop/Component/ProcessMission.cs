using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class ProcessMission : Table
	{
		public enum Fields { misn_sn, misn_contents, compn_sn };
		public enum WriteFields { misn_contents, compn_sn };

		public int misn_sn { get; set; }
		public string misn_contents { get; set; }
		public int compn_sn { get; set; }

		public static string TableName { get { return "so_compn_procs_misn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.misn_sn, misn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ProcessMission obj)
		{
			this.misn_sn = obj.misn_sn;
			this.misn_contents = obj.misn_contents;
			this.compn_sn = obj.compn_sn;
		}
	}
}

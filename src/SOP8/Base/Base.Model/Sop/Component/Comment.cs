using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class Comment : Table
	{
		public enum Fields { compn_sn, contents };
		public enum WriteFields { compn_sn, contents };

		public int compn_sn { get; set; }
		public string contents { get; set; }

		public static string TableName { get { return "so_compn_cm"; } }

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

		public void FromCopy(Comment obj)
		{
			this.compn_sn = obj.compn_sn;
			this.contents = obj.contents;
		}
	}
}

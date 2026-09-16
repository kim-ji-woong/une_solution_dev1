using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class RackGroup : Table
	{
		public enum Fields { RackGroupNo, DataCenterNo, GroupName };
		public enum WriteFields { DataCenterNo, GroupName };

		public int RackGroupNo { get; set; }
		public int DataCenterNo { get; set; }
		public string GroupName { get; set; }

		public static string TableName { get { return "RackGroup"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.RackGroupNo, RackGroupNo);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}

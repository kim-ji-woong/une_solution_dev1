using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class ItemData : Table
	{
		public enum Fields { ItemNo, Temperature, Power };
		public enum WriteFields { ItemNo, Temperature, Power };

		public int ItemNo { get; set; }
		public double Temperature { get; set; }
		public double Power { get; set; }

		public static string TableName { get { return "ItemData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ItemNo, ItemNo);
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

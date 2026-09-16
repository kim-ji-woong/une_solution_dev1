using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Item_RU : Table
	{
		public enum Fields { ItemNo, RackNo, UPos };
		public enum WriteFields { ItemNo, RackNo, UPos };

		public int ItemNo { get; set; }
		public int RackNo { get; set; }
		public int UPos { get; set; }

		public static string TableName { get { return "Item_RU"; } }

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

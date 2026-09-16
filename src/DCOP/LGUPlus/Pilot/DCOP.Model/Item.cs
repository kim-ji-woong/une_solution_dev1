using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Item : Table
	{
		public enum Fields { ItemNo, ItemName, DataCenterNo, ItemTypeNo, RegTime, Barcode };
		public enum WriteFields { ItemName, DataCenterNo, ItemTypeNo, RegTime, Barcode };

		public int ItemNo { get; set; }
		public string ItemName { get; set; }
		public int DataCenterNo { get; set; }
		public int ItemTypeNo { get; set; }
		public DateTime RegTime { get; set; }
		public string Barcode { get; set; }

		public static string TableName { get { return "Item"; } }

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

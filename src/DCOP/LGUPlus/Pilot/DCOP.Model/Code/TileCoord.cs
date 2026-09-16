using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Code
{
	public class TileCoord : Table
	{
		public enum Fields { CodeName, Barcode, CodeTypeNo, CodeLevel };
		public enum WriteFields { CodeName, Barcode, CodeTypeNo, CodeLevel };

		public string CodeName { get; set; }
		public string Barcode { get; set; }
		public int CodeTypeNo { get; set; }
		public int CodeLevel { get; set; }

		public static string TableName { get { return "CodeTileCoord"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = '{1}'", Fields.CodeName, CodeName);
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

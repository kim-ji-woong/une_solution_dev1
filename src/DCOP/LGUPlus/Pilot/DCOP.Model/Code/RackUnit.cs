using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Code
{
	public class RackUnit : Table
	{
		public enum Fields { RackUnitNo, Barcode, CodeTypeNo };
		public enum WriteFields { RackUnitNo, Barcode, CodeTypeNo };

		public int RackUnitNo { get; set; }
		public string Barcode { get; set; }
		public int CodeTypeNo { get; set; }

		public static string TableName { get { return "CodeRackUnit"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.RackUnitNo, RackUnitNo);
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

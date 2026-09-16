using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class CodeType : Table
	{
		public enum Fields { CodeTypeNo, CodeTypeName, CodeTypeEngName, CodeLength, CodeCount };
		public enum WriteFields { CodeTypeNo, CodeTypeName, CodeTypeEngName, CodeLength, CodeCount };

		public int CodeTypeNo { get; set; }
		public string CodeTypeName { get; set; }
		public string CodeTypeEngName { get; set; }
		public int CodeLength { get; set; }
		public int CodeCount { get; set; }

		public static string TableName { get { return "CodeType"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.CodeTypeNo, CodeTypeNo);
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

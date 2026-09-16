using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class DataCenterData : Table
	{
		public enum Fields { DataCenterNo, PropertyName, PropertyValue };
		public enum WriteFields { DataCenterNo, PropertyName, PropertyValue };

		public int DataCenterNo { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }

		public static string TableName { get { return "DataCenterData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = '{3}'", Fields.DataCenterNo, DataCenterNo, Fields.PropertyName, PropertyName);
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

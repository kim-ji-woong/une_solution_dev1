using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmWebService.Models
{
    class CurrentAlarm : Table
    {
		public enum AlarmTypes { Fire = 0, Flooding, Earthquake, Terror }

		public enum Fields { AlarmType, AlarmValue, Description };
		public enum WriteFields { AlarmType, AlarmValue, Description };

		public int AlarmType { get; set; }
		public double? AlarmValue { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "CurrentAlarm"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("AlarmType = {0}", AlarmType);
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

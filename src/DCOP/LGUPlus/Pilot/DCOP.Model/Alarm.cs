using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Alarm : Table
	{
		public enum Fields { AlarmNo, AlarmType, AlarmTime, ClearTime, RackNo, ItemNo, ImagePath1, ImagePath2 };
		public enum WriteFields { AlarmType, AlarmTime, ClearTime, RackNo, ItemNo, ImagePath, ImagePath2 };

		public int AlarmNo { get; set; }
		public string AlarmType { get; set; }
		public DateTime AlarmTime { get; set; }
		public DateTime? ClearTime { get; set; }
		public int RackNo { get; set; }
		public int ItemNo { get; set; }
		public string ImagePath1 { get; set; }
		public string ImagePath2 { get; set; }

		public static string TableName { get { return "Alarm"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.AlarmNo, AlarmNo);
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

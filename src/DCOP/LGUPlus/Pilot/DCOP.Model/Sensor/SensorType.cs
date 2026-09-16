using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Sensor
{
	public class SensorType : Table
	{
		public enum Fields { SensorTypeNo, Name, EngName, Unit, ImageUrl };
		public enum WriteFields { SensorTypeNo, Name, EngName, Unit, ImageUrl };

		public int SensorTypeNo { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }
		public string Unit { get; set; }
		public string ImageUrl { get; set; }

		public static string TableName { get { return "SensorType"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SensorTypeNo, SensorTypeNo);
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

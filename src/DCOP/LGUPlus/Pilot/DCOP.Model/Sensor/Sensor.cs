using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model.Sensor
{
	public class Sensor : Table
	{
		public enum Fields { SensorNo, Name, SensorTypeNo, DataCenterNo, RegTime, UpdateTime, X, Y, Z, Value };
		public enum WriteFields { Name, SensorTypeNo, DataCenterNo, RegTime, UpdateTime, X, Y, Z, Value };

		public int SensorNo { get; set; }
		public string Name { get; set; }
		public int SensorTypeNo { get; set; }
		public int DataCenterNo { get; set; }
		public DateTime RegTime { get; set; }
		public DateTime? UpdateTime { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int Z { get; set; }
		public double? Value { get; set; }

		public static string TableName { get { return "Sensor"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SensorNo, SensorNo);
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

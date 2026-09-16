using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Rack : Table
	{
		public enum Fields { RackNo, RackName, DataCenterNo, RackGroupNo, RackTypeNo, Rotation, X, Y, Z, RegTime, Barcode };
		public enum WriteFields { RackName, DataCenterNo, RackGroupNo, RackTypeNo, Rotation, X, Y, Z, RegTime, Barcode };

		public int RackNo { get; set; }
		public string RackName { get; set; }
		public int DataCenterNo { get; set; }
		public int? RackGroupNo { get; set; }
		public int RackTypeNo { get; set; }
		public double Rotation { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int Z { get; set; }
		public DateTime RegTime { get; set; }
		public string Barcode { get; set; }

		public static string TableName { get { return "Rack"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.RackNo, RackNo);
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

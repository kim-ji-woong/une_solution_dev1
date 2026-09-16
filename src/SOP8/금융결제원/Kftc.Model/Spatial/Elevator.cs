using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Kftc.Model.Spatial
{
    public class Elevator : Table
	{
		public enum Fields { zone_sn, x, y, z };
		public enum WriteFields { zone_sn, x, y, z };

		public int zone_sn { get; set; }
		public double? x { get; set; }
		public double? y { get; set; }
		public double? z { get; set; }

		public static string TableName { get { return "sp_elevator"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.zone_sn, zone_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Elevator obj)
		{
			this.zone_sn = obj.zone_sn;
			this.x = obj.x;
			this.y = obj.y;
			this.z = obj.z;
		}
	}
}

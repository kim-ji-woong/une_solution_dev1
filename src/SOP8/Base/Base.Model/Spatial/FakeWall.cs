using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class FakeWall : Table
	{
		public enum Fields { fake_wall_sn, zone_sn, x, y, z, rtate, scale };
		public enum WriteFields { zone_sn, x, y, z, rtate, scale };

		public int fake_wall_sn { get; set; }
		public int zone_sn { get; set; }
		public double x { get; set; }
		public double y { get; set; }
		public double z { get; set; }
		public double rtate { get; set; }
		public double scale { get; set; }

		public static string TableName { get { return "sp_fake_wall"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.fake_wall_sn, fake_wall_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(FakeWall obj)
		{
			this.fake_wall_sn = obj.fake_wall_sn;
			this.zone_sn = obj.zone_sn;
			this.x = obj.x;
			this.y = obj.y;
			this.z = obj.z;
			this.rtate = obj.rtate;
			this.scale = obj.scale;
		}
	}
}

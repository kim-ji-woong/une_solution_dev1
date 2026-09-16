using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class ZoneData : Table
	{
		public enum Fields { zone_sn, fake_wall_elev, poi_elev };
		public enum WriteFields { zone_sn, fake_wall_elev, poi_elev };

		public int zone_sn { get; set; }
		public double? fake_wall_elev { get; set; }
		public double? poi_elev { get; set; }

		public static string TableName { get { return "sp_zone_data"; } }

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

		public void FromCopy(ZoneData obj)
		{
			this.zone_sn = obj.zone_sn;
			this.fake_wall_elev = obj.fake_wall_elev;
			this.poi_elev = obj.poi_elev;
		}
	}
}

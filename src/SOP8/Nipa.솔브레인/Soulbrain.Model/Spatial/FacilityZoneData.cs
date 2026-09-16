using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Spatial
{
    public class FacilityZoneData : Table
    {
		public enum Fields { zone_sn, fclty_type_code, poi_elev };
		public enum WriteFields { zone_sn, fclty_type_code, poi_elev };

		public int zone_sn { get; set; }
		public int fclty_type_code { get; set; }
		public double? poi_elev { get; set; }

		public static string TableName { get { return "sp_fclty_zone_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.zone_sn, zone_sn, Fields.fclty_type_code, fclty_type_code);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(FacilityZoneData obj)
		{
			this.zone_sn = obj.zone_sn;
			this.fclty_type_code = obj.fclty_type_code;
			this.poi_elev = obj.poi_elev;
		}
	}
}

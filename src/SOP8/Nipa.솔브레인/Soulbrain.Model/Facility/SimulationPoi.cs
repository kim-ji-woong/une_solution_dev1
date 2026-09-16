using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
	public class SimulationPoi : Table
	{
		public enum Fields { poi_sn, poi_name, x, y, z };
		public enum WriteFields { poi_sn, poi_name, x, y, z };

		public int poi_sn { get; set; }
		public string poi_name { get; set; }
		public double x { get; set; }
		public double y { get; set; }
		public double z { get; set; }

		public static string TableName { get { return "fa_simlatn_poi"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.poi_sn, poi_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SimulationPoi obj)
		{
			this.poi_sn = obj.poi_sn;
			this.poi_name = obj.poi_name;
			this.x = obj.x;
			this.y = obj.y;
			this.z = obj.z;
		}
	}
}

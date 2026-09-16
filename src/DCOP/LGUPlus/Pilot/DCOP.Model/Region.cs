using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
    public class Region : Table
	{
		public enum Fields { RegionNo, RegionName, ParentRegionNo };
		public enum WriteFields { RegionNo, RegionName, ParentRegionNo };

		public int RegionNo { get; set; }
		public string RegionName { get; set; }
		public int? ParentRegionNo { get; set; }

		public static string TableName { get { return "Region"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.RegionNo, RegionNo);
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

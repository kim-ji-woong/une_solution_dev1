using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class Facility : Table
	{
		public enum Fields { FacilityNo, FacilityName, DataCenterNo, ImagePath };
		public enum WriteFields { FacilityNo, FacilityName, DataCenterNo, ImagePath };

		public int FacilityNo { get; set; }
		public string FacilityName { get; set; }
		public int DataCenterNo { get; set; }
		public string ImagePath { get; set; }

		public static string TableName { get { return "Facility"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.FacilityNo, FacilityNo);
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

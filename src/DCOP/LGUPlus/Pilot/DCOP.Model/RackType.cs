using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class RackType : Table
	{
		public enum Fields { RackTypeNo, CompanyNo, ModelName, Height, Width, Depth, Unit, ImageUrl, GlbUrl, FbxUrl, Type, RegTime, Barcode };
		public enum WriteFields { RackTypeNo, CompanyNo, ModelName, Height, Width, Depth, Unit, ImageUrl, GlbUrl, FbxUrl, Type, RegTime, Barcode };

		public int RackTypeNo { get; set; }
		public int CompanyNo { get; set; }
		public string ModelName { get; set; }
		public int Height { get; set; }
		public int Width { get; set; }
		public int Depth { get; set; }
		public int Unit { get; set; }
		public string ImageUrl { get; set; }
		public string GlbUrl { get; set; }
		public string FbxUrl { get; set; }
		public string Type { get; set; }
		public DateTime RegTime { get; set; }
		public string Barcode { get; set; }

		public static string TableName { get { return "RackType"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.RackTypeNo, RackTypeNo);
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

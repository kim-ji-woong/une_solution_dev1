using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class ItemType : Table
	{
		public enum Fields { ItemTypeNo, EquipmentTypeNo, CompanyNo, ModelName, Height, Width, Depth, Unit, ImageUrl, GlbUrl, FbxUrl, Type, RegTime };
		public enum WriteFields { ItemTypeNo, EquipmentTypeNo, CompanyNo, ModelName, Height, Width, Depth, Unit, ImageUrl, GlbUrl, FbxUrl, Type, RegTime };

		public int ItemTypeNo { get; set; }
		public int EquipmentTypeNo { get; set; }
		public int CompanyNo { get; set; }
		public string ModelName { get; set; }
		public int? Height { get; set; }
		public int? Width { get; set; }
		public int? Depth { get; set; }
		public int Unit { get; set; }
		public string ImageUrl { get; set; }
		public string GlbUrl { get; set; }
		public string FbxUrl { get; set; }
		public string Type { get; set; }
		public DateTime RegTime { get; set; }

		public static string TableName { get { return "ItemType"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ItemTypeNo, ItemTypeNo);
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

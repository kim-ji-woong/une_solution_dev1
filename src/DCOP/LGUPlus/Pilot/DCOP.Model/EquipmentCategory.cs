using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class EquipmentCategory : Table
	{
		public enum Fields { EquipmentCategoryNo, EquipmentCategoryName };
		public enum WriteFields { EquipmentCategoryNo, EquipmentCategoryName };

		public int EquipmentCategoryNo { get; set; }
		public string EquipmentCategoryName { get; set; }

		public static string TableName { get { return "EquipmentCategory"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.EquipmentCategoryNo, EquipmentCategoryNo);
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

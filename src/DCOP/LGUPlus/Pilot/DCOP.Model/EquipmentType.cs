using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.Model
{
	public class EquipmentType : Table
	{
		public enum Fields { EquipmentTypeNo, EquipmentTypeName, EquipmentCategoryNo };
		public enum WriteFields { EquipmentTypeNo, EquipmentTypeName, EquipmentCategoryNo };

		public int EquipmentTypeNo { get; set; }
		public string EquipmentTypeName { get; set; }
		public int EquipmentCategoryNo { get; set; }

		public static string TableName { get { return "EquipmentType"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.EquipmentTypeNo, EquipmentTypeNo);
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

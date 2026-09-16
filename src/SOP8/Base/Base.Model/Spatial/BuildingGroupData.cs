using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class BuildingGroupData : Table, IComparable
	{
		public enum Fields { buld_group_sn, ordr_indx, name, value, wdt, indent_level };
		public enum WriteFields { buld_group_sn, ordr_indx, name, value, wdt, indent_level };

		public int buld_group_sn { get; set; }
		public int ordr_indx { get; set; }
		public string name { get; set; }
		public string value { get; set; }
		public bool wdt { get; set; }
		public int? indent_level { get; set; }

		public static string TableName { get { return "sp_buld_group_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.buld_group_sn, buld_group_sn, Fields.ordr_indx, ordr_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(BuildingGroupData obj)
		{
			this.buld_group_sn = obj.buld_group_sn;
			this.ordr_indx = obj.ordr_indx;
			this.name = obj.name;
			this.value = obj.value;
			this.wdt = obj.wdt;
			this.indent_level = obj.indent_level;
		}

		public int CompareTo(object obj)
		{
			BuildingGroupData data1 = this;
			BuildingGroupData data2 = (BuildingGroupData)obj;

			if (data1.buld_group_sn < data1.buld_group_sn)
				return -1;
			else if (data1.buld_group_sn > data1.buld_group_sn)
				return 1;
			else
			{
				if (data1.ordr_indx < data2.ordr_indx)
					return -1;
				else if (data1.ordr_indx > data2.ordr_indx)
					return 1;
			}

			return 0;
		}
	}
}

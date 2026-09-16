using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Spatial
{
	public class BuildingData : Table, IComparable
	{
		public enum Fields { buld_sn, ordr_indx, name, value, wdt, indent_level };
		public enum WriteFields { buld_sn, ordr_indx, name, value, wdt, indent_level };

		public int buld_sn { get; set; }
		public int ordr_indx { get; set; }
		public string name { get; set; }
		public string value { get; set; }
		public bool wdt { get; set; }
		public int? indent_level { get; set; }

		public static string TableName { get { return "sp_buld_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.buld_sn, buld_sn, Fields.ordr_indx, ordr_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(BuildingData obj)
		{
			this.buld_sn = obj.buld_sn;
			this.ordr_indx = obj.ordr_indx;
			this.name = obj.name;
			this.value = obj.value;
			this.wdt = obj.wdt;
			this.indent_level = obj.indent_level;
		}

		public int CompareTo(object obj)
		{
			BuildingData data1 = this;
			BuildingData data2 = (BuildingData)obj;

			if (data1.buld_sn < data1.buld_sn)
				return -1;
			else if (data1.buld_sn > data1.buld_sn)
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

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
    public class FacilityData : Table, IComparable
	{
		public enum Fields { fclty_sn, ordr_indx, name, value, wdt, indent_level };
		public enum WriteFields { fclty_sn, ordr_indx, name, value, wdt, indent_level };

		public int fclty_sn { get; set; }
		public int ordr_indx { get; set; }
		public string name { get; set; }
		public string value { get; set; }
		public bool wdt { get; set; }
		public int? indent_level { get; set; }

		public static string TableName { get { return "fa_fclty_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.fclty_sn, fclty_sn, Fields.ordr_indx, ordr_indx);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(FacilityData obj)
		{
			this.fclty_sn = obj.fclty_sn;
			this.ordr_indx = obj.ordr_indx;
			this.name = obj.name;
			this.value = obj.value;
			this.wdt = obj.wdt;
			this.indent_level = obj.indent_level;
		}

		public int CompareTo(object obj)
		{
			FacilityData data1 = this;
			FacilityData data2 = (FacilityData)obj;

			if (data1.fclty_sn < data1.fclty_sn)
				return -1;
			else if (data1.fclty_sn > data1.fclty_sn)
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

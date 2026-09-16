using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Facility
{
    public class Facility : Table
    {
		public enum Fields { fclty_sn, model_name, fclty_name, zone_sn };
		public enum WriteFields { fclty_sn, model_name, fclty_name, zone_sn };

		public int fclty_sn { get; set; }
		public string model_name { get; set; }
		public string fclty_name { get; set; }
		public int zone_sn { get; set; }

		public static string TableName { get { return "fa_fclty"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.fclty_sn, fclty_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Facility obj)
		{
			this.fclty_sn = obj.fclty_sn;
			this.model_name = obj.model_name;
			this.fclty_name = obj.fclty_name;
			this.zone_sn = obj.zone_sn;
		}
	}
}

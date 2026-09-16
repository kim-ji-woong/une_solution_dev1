using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Sop.Component
{
	public class DecisionAutoScriptVariable : Table
	{
		public enum Fields { compn_sn, vriabl_name, dcs_vriabl_optn_code, dcs_vriabl_code };
		public enum WriteFields { compn_sn, vriabl_name, dcs_vriabl_optn_code, dcs_vriabl_code };

		public int compn_sn { get; set; }
		public string vriabl_name { get; set; }
		public int dcs_vriabl_optn_code { get; set; }
		public int dcs_vriabl_code { get; set; }

		public static string TableName { get { return "so_compn_dcs_atmc_script_vriabl"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.compn_sn, compn_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(DecisionAutoScriptVariable obj)
		{
			this.compn_sn = obj.compn_sn;
			this.vriabl_name = obj.vriabl_name;
			this.dcs_vriabl_optn_code = obj.dcs_vriabl_optn_code;
			this.dcs_vriabl_code = obj.dcs_vriabl_code;
		}
	}
}

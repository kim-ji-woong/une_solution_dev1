using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Soulbrain.Model.Cfd
{
    public class ScenarioCase : Table, IComparable
	{
		public enum Fields { senario_case_sn, senario_sn, frme_secnd, file_url };
		public enum WriteFields { senario_case_sn, senario_sn, frme_secnd, file_url };

		public int senario_case_sn { get; set; }
		public int senario_sn { get; set; }
		public int frme_secnd { get; set; }
		public string file_url { get; set; }

		public static string TableName { get { return "cfd_senario_case"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.senario_case_sn, senario_case_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ScenarioCase obj)
		{
			this.senario_case_sn = obj.senario_case_sn;
			this.senario_sn = obj.senario_sn;
			this.frme_secnd = obj.frme_secnd;
			this.file_url = obj.file_url;
		}

		public int CompareTo(object obj)
		{
			ScenarioCase case1 = this;
			ScenarioCase case2 = (ScenarioCase)obj;

			if (case1.frme_secnd < case2.frme_secnd)
				return -1;
			else if (case1.frme_secnd > case2.frme_secnd)
				return 1;
			return 0;
		}
	}
}

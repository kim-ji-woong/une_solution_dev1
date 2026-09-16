using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Account
{
	public class Session : Table
	{
		public enum Fields { user_sn, session_key, creat_de, updt_de, atmc_login_yn };
		public enum WriteFields { user_sn, session_key, creat_de, updt_de, atmc_login_yn };

		public int user_sn { get; set; }
		public string session_key { get; set; }
		public DateTime creat_de { get; set; }
		public DateTime updt_de { get; set; }
		public bool atmc_login_yn { get; set; }

		public static string TableName { get { return "acc_session"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.user_sn, user_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Session obj)
		{
			this.user_sn = obj.user_sn;
			this.session_key = obj.session_key;
			this.creat_de = obj.creat_de;
			this.updt_de = obj.updt_de;
			this.atmc_login_yn = obj.atmc_login_yn;
		}
	}
}

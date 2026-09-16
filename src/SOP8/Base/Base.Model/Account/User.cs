using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Account
{
	public class User : Table
	{
		public enum Fields { user_sn, grad_sn, rgl_memb_sn, password, user_id, user_name, password_key, password_salt, site_sn, memo };
		public enum WriteFields { grad_sn, rgl_memb_sn, password, user_id, user_name, password_key, password_salt, site_sn, memo };

		public int user_sn { get; set; }
		public int grad_sn { get; set; }
		public int? rgl_memb_sn { get; set; }
		public string password { get; set; }
		public string user_id { get; set; }
		public string user_name { get; set; }
		public string/* nullable */ password_key { get; set; }
		public string password_salt { get; set; }
		public int? site_sn { get; set; }
		public string/* nullable */ memo { get; set; }

		public static string TableName { get { return "acc_user"; } }

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

		public void FromCopy(User obj)
		{
			this.user_sn = obj.user_sn;
			this.grad_sn = obj.grad_sn;
			this.rgl_memb_sn = obj.rgl_memb_sn;
			this.password = obj.password;
			this.user_id = obj.user_id;
			this.user_name = obj.user_name;
			this.password_key = obj.password_key;
			this.password_salt = obj.password_salt;
			this.site_sn = obj.site_sn;
			this.memo = obj.memo;
		}
	}
}

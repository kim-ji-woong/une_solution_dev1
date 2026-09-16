using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Gltf
{
	public class Model : Table
	{
		public enum Fields { gltf_model_sn, parnts_sn, model_name, site_sn };
		public enum WriteFields { gltf_model_sn, parnts_sn, model_name, site_sn };

		public int gltf_model_sn { get; set; }
		public int? parnts_sn { get; set; }
		public string model_name { get; set; }
		public int site_sn { get; set; }

		public static string TableName { get { return "sdms_gltf_model"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.gltf_model_sn, gltf_model_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Model obj)
		{
			this.gltf_model_sn = obj.gltf_model_sn;
			this.parnts_sn = obj.parnts_sn;
			this.model_name = obj.model_name;
			this.site_sn = obj.site_sn;
		}
	}
}

using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Gltf
{
	public class ModelOrthoData : Table
	{
		public enum Fields { gltf_model_ortho_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, trgt_x, trgt_y, trgt_z, zoom, zone_sn };
		public enum WriteFields { gltf_model_ortho_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, trgt_x, trgt_y, trgt_z, zoom, zone_sn };

		public int gltf_model_ortho_data_sn { get; set; }
		public int gltf_model_sn { get; set; }
		public string model_file { get; set; }
		public double camera_lc_x { get; set; }
		public double camera_lc_y { get; set; }
		public double camera_lc_z { get; set; }
		public double camera_rtate_x { get; set; }
		public double camera_rtate_y { get; set; }
		public double camera_rtate_z { get; set; }
		public double trgt_x { get; set; }
		public double trgt_y { get; set; }
		public double trgt_z { get; set; }
		public double zoom { get; set; }
		public int? zone_sn { get; set; }

		public static string TableName { get { return "sdms_gltf_model_ortho_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.gltf_model_ortho_data_sn, gltf_model_ortho_data_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ModelOrthoData obj)
		{
			this.gltf_model_ortho_data_sn = obj.gltf_model_ortho_data_sn;
			this.gltf_model_sn = obj.gltf_model_sn;
			this.model_file = obj.model_file;
			this.camera_lc_x = obj.camera_lc_x;
			this.camera_lc_y = obj.camera_lc_y;
			this.camera_lc_z = obj.camera_lc_z;
			this.camera_rtate_x = obj.camera_rtate_x;
			this.camera_rtate_y = obj.camera_rtate_y;
			this.camera_rtate_z = obj.camera_rtate_z;
			this.trgt_x = obj.trgt_x;
			this.trgt_y = obj.trgt_y;
			this.trgt_z = obj.trgt_z;
			this.zoom = obj.zoom;
			this.zone_sn = obj.zone_sn;
		}
	}
}

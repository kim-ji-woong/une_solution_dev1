using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.Model.Gltf
{
	public class ModelData : Table
	{
		public enum Fields { gltf_model_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, fov, near, far, orbit_x, orbit_y, orbit_z, buld_group_sn, buld_sn, zone_sn, floor_indx };
		public enum WriteFields { gltf_model_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, fov, near, far, orbit_x, orbit_y, orbit_z, buld_group_sn, buld_sn, zone_sn, floor_indx };

		public int gltf_model_data_sn { get; set; }
		public int gltf_model_sn { get; set; }
		public string/* nullable */ model_file { get; set; }
		public double camera_lc_x { get; set; }
		public double camera_lc_y { get; set; }
		public double camera_lc_z { get; set; }
		public double camera_rtate_x { get; set; }
		public double camera_rtate_y { get; set; }
		public double camera_rtate_z { get; set; }
		public double fov { get; set; }
		public double near { get; set; }
		public double far { get; set; }
		public double orbit_x { get; set; }
		public double orbit_y { get; set; }
		public double orbit_z { get; set; }
		public int? buld_group_sn { get; set; }
		public int? buld_sn { get; set; }
		public int? zone_sn { get; set; }
		public double? floor_indx { get; set; }

		public static string TableName { get { return "sdms_gltf_model_data"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.gltf_model_data_sn, gltf_model_data_sn);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ModelData obj)
		{
			this.gltf_model_data_sn = obj.gltf_model_data_sn;
			this.gltf_model_sn = obj.gltf_model_sn;
			this.model_file = obj.model_file;
			this.camera_lc_x = obj.camera_lc_x;
			this.camera_lc_y = obj.camera_lc_y;
			this.camera_lc_z = obj.camera_lc_z;
			this.camera_rtate_x = obj.camera_rtate_x;
			this.camera_rtate_y = obj.camera_rtate_y;
			this.camera_rtate_z = obj.camera_rtate_z;
			this.fov = obj.fov;
			this.near = obj.near;
			this.far = obj.far;
			this.orbit_x = obj.orbit_x;
			this.orbit_y = obj.orbit_y;
			this.orbit_z = obj.orbit_z;
			this.buld_group_sn = obj.buld_group_sn;
			this.buld_sn = obj.buld_sn;
			this.zone_sn = obj.zone_sn;
			this.floor_indx = obj.floor_indx;
		}
	}
}

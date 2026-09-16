package egovframework.base.model.gltf;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelData {
	public enum Fields { gltf_model_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, fov, near, far, orbit_x, orbit_y, orbit_z, buld_group_sn, buld_sn, zone_sn, floor_indx }

	private int gltf_model_data_sn;

	private int gltf_model_sn;

	private String model_file;

	private double camera_lc_x;

	private double camera_lc_y;

	private double camera_lc_z;

	private double camera_rtate_x;

	private double camera_rtate_y;

	private double camera_rtate_z;

	private double fov;

	private double near;

	private double far;

	private double orbit_x;

	private double orbit_y;

	private double orbit_z;

	private Integer buld_group_sn;

	private Integer buld_sn;

	private Integer zone_sn;

	private Double floor_indx;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sdms_gltf_model_data";
	public static final String[] primaryKeys = { "gltf_model_data_sn" };

}

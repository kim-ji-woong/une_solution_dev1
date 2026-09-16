package egovframework.base.model.gltf;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelOrthoData {
	public enum Fields { gltf_model_ortho_data_sn, gltf_model_sn, model_file, camera_lc_x, camera_lc_y, camera_lc_z, camera_rtate_x, camera_rtate_y, camera_rtate_z, trgt_x, trgt_y, trgt_z, zoom, zone_sn }

	private int gltf_model_ortho_data_sn;

	private int gltf_model_sn;

	@NonNull
	@Builder.Default
	private String model_file = "";

	private double camera_lc_x;

	private double camera_lc_y;

	private double camera_lc_z;

	private double camera_rtate_x;

	private double camera_rtate_y;

	private double camera_rtate_z;

	private double trgt_x;

	private double trgt_y;

	private double trgt_z;

	private double zoom;

	private Integer zone_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sdms_gltf_model_ortho_data";
	public static final String[] primaryKeys = { "gltf_model_ortho_data_sn" };

}

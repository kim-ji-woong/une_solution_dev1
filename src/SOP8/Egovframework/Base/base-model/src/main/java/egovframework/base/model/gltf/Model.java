package egovframework.base.model.gltf;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Model {
	public enum Fields { gltf_model_sn, parnts_sn, model_name, site_sn }

	private int gltf_model_sn;

	private Integer parnts_sn;

	@NonNull
	@Builder.Default
	private String model_name = "";

	private int site_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sdms_gltf_model";
	public static final String[] primaryKeys = { "gltf_model_sn" };

}

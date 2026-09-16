package egovframework.base.model.sop.category;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiddleClass {
	public enum Fields { mclas_sn, lclas_sn, mclas_name }

	private int mclas_sn;

	private int lclas_sn;

	@NonNull
	@Builder.Default
	private String mclas_name = "";

	public static final String autoIncreaseField = "mclas_sn";
	public static final String tableName = "so_ctgry_mclas";
	public static final String[] primaryKeys = { "mclas_sn" };

}

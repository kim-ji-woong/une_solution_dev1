package egovframework.base.model.sop.category;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LargeClass {
	public enum Fields { lclas_sn, lclas_name, site_sn }

	private int lclas_sn;

	@NonNull
	@Builder.Default
	private String lclas_name = "";

	private int site_sn;

	public static final String autoIncreaseField = "lclas_sn";
	public static final String tableName = "so_ctgry_lclas";
	public static final String[] primaryKeys = { "lclas_sn" };

}

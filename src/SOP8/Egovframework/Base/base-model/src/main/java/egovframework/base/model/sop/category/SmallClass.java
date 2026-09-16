package egovframework.base.model.sop.category;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmallClass {
	public enum Fields { sclas_sn, sclas_name, mclas_sn, ver_sn, nor_yn, descp }

	private int sclas_sn;

	@NonNull
	@Builder.Default
	private String sclas_name = "";

	private int mclas_sn;

	private int ver_sn;

	private boolean nor_yn;

	private String descp;

	public static final String autoIncreaseField = "sclas_sn";
	public static final String tableName = "so_ctgry_sclas";
	public static final String[] primaryKeys = { "sclas_sn" };

}

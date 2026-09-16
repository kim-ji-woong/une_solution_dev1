package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Endpoint {
	public enum Fields { compn_sn, title, begin_yn, execut_no }

	private int compn_sn;

	@NonNull
	@Builder.Default
	private String title = "";

	private boolean begin_yn;

	private Integer execut_no;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_end_point";
	public static final String[] primaryKeys = { "compn_sn" };

}

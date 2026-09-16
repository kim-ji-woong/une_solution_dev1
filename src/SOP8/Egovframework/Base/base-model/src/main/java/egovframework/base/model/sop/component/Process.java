package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Process {
	public enum Fields { compn_sn, title, leadr_prvuse_yn, atmc_execut_yn, execut_no }

	private int compn_sn;

	@NonNull
	@Builder.Default
	private String title = "";

	private Boolean leadr_prvuse_yn;

	private boolean atmc_execut_yn;

	private Integer execut_no;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_procs";
	public static final String[] primaryKeys = { "compn_sn" };

}

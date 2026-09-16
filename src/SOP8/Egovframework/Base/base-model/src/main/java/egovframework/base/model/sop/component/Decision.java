package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Decision {
	public enum Fields { compn_sn, title, descp, atmc_execut_script, execut_no }

	private int compn_sn;

	@NonNull
	@Builder.Default
	private String title = "";

	private String descp;

	private String atmc_execut_script;

	private Integer execut_no;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_dcs";
	public static final String[] primaryKeys = { "compn_sn" };

}

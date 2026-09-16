package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DecisionAutoScriptVariable {
	public enum Fields { compn_sn, vriabl_name, dcs_vriabl_optn_code, dcs_vriabl_code }

	private int compn_sn;

	@NonNull
	@Builder.Default
	private String vriabl_name = "";

	private int dcs_vriabl_optn_code;

	private int dcs_vriabl_code;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_dcs_atmc_script_vriabl";
	public static final String[] primaryKeys = { "compn_sn" };

}

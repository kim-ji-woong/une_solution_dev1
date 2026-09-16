package egovframework.base.model.sop.category;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SopCategoryActionStep {
	public enum Fields { action_step_sn, action_step_name, sclas_sn }

	private int action_step_sn;

	@NonNull
	@Builder.Default
	private String action_step_name = "";

	private int sclas_sn;

	public static final String autoIncreaseField = "action_step_sn";
	public static final String tableName = "so_ctgry_action_step";
	public static final String[] primaryKeys = { "action_step_sn" };

}

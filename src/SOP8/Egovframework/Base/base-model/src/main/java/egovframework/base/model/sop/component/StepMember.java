package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StepMember {
	public enum Fields { step_memb_sn, action_step_sn }

	private int step_memb_sn;

	private int action_step_sn;

	public static final String autoIncreaseField = "step_memb_sn";
	public static final String tableName = "so_compn_step_memb";
	public static final String[] primaryKeys = { "step_memb_sn" };

}

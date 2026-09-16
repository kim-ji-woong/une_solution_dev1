package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessMission {
	public enum Fields { misn_sn, misn_contents, compn_sn }

	private int misn_sn;

	@NonNull
	@Builder.Default
	private String misn_contents = "";

	private int compn_sn;

	public static final String autoIncreaseField = "misn_sn";
	public static final String tableName = "so_compn_procs_misn";
	public static final String[] primaryKeys = { "misn_sn" };

}

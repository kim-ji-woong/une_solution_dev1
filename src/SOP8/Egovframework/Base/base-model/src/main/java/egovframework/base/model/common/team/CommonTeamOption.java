package egovframework.base.model.common.team;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonTeamOption {
	public enum Fields { team_optn_ty_no, team_optn_no, team_optn_name }

	private int team_optn_ty_no;

	private int team_optn_no;

	@NonNull
	@Builder.Default
	private String team_optn_name = "";

	public static final String autoIncreaseField = null;
	public static final String tableName = "co_team_optn";
	public static final String[] primaryKeys = { "team_optn_ty_no", "team_optn_no" };

}

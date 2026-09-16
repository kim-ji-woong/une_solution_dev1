package egovframework.base.model.common.team;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Regular {
	public enum Fields { rgl_sn, team_name, parnts_sn, site_sn }

	private int rgl_sn;

	@NonNull
	@Builder.Default
	private String team_name = "";

	private Integer parnts_sn;

	private Integer site_sn;

	public static final String autoIncreaseField = "rgl_sn";
	public static final String tableName = "co_team_rgl";
	public static final String[] primaryKeys = { "rgl_sn" };

}

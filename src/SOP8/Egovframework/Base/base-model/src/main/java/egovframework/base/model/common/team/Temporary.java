package egovframework.base.model.common.team;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Temporary {
	public enum Fields { tmpr_sn, parnts_sn, team_name, nor_yn, site_sn }

	private int tmpr_sn;

	private Integer parnts_sn;

	@NonNull
	@Builder.Default
	private String team_name = "";

	private boolean nor_yn;

	private int site_sn;

	public static final String autoIncreaseField = "tmpr_sn";
	public static final String tableName = "co_team_tmpr";
	public static final String[] primaryKeys = { "tmpr_sn" };

}

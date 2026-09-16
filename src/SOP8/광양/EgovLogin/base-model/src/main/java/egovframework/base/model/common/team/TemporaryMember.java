package egovframework.base.model.common.team;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryMember {
	public enum Fields { tmpr_memb_sn, disp_name, tmpr_sn, rgl_sn, rgl_memb_sn, role_optn_no, role_no, memo }

	private int tmpr_memb_sn;

	private String disp_name;

	private int tmpr_sn;

	private Integer rgl_sn;

	private Integer rgl_memb_sn;

	private Integer role_optn_no;

	private Integer role_no;

	private String memo;

	public static final String autoIncreaseField = "tmpr_memb_sn";
	public static final String tableName = "co_team_tmpr_memb";
	public static final String[] primaryKeys = { "tmpr_memb_sn" };

}

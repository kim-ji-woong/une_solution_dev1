package egovframework.base.model.common.team;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegularMember {
	public enum Fields { rgl_memb_sn, rgl_sn, memb_name, unq_key, offm_telno, telno, email, clsf_optn_no, clsf_no, ofcps_optn_no, ofcps_no, dty_sttus_optn_no, dty_sttus_no, memo }

	private int rgl_memb_sn;

	private int rgl_sn;

	@NonNull
	@Builder.Default
	private String memb_name = "";

	private String unq_key;

	private String offm_telno;

	private String telno;

	private String email;

	private Integer clsf_optn_no;

	private Integer clsf_no;

	private Integer ofcps_optn_no;

	private Integer ofcps_no;

	private Integer dty_sttus_optn_no;

	private Integer dty_sttus_no;

	private String memo;

	public static final String autoIncreaseField = "rgl_memb_sn";
	public static final String tableName = "co_team_rgl_memb";
	public static final String[] primaryKeys = { "rgl_memb_sn" };

}

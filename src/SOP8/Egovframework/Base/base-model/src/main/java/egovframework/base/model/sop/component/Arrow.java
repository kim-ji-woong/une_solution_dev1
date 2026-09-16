package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Arrow {
	public enum Fields { arrw_sn, contents, lc_optn_code, begin_compn_sn, begin_arrw_lc_code, end_compn_sn, end_arrw_lc_code, step_memb_sn }

	private int arrw_sn;

	private String contents;

	private int lc_optn_code;

	private int begin_compn_sn;

	private int begin_arrw_lc_code;

	private int end_compn_sn;

	private int end_arrw_lc_code;

	private int step_memb_sn;

	public static final String autoIncreaseField = "arrw_sn";
	public static final String tableName = "so_compn_arrow";
	public static final String[] primaryKeys = { "arrw_sn" };

}

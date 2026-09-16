package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SopComponentComponent {
	public enum Fields { compn_sn, grid_sn, column_no, row_no, compn_optn_code, compn_code, step_memb_sn }

	private int compn_sn;

	private int grid_sn;

	private int column_no;

	private int row_no;

	private int compn_optn_code;

	private int compn_code;

	private int step_memb_sn;

	public static final String autoIncreaseField = "compn_sn";
	public static final String tableName = "so_compn";
	public static final String[] primaryKeys = { "compn_sn" };

}

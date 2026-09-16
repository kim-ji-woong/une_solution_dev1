package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GridRow {
	public enum Fields { grid_sn, row_no, height }

	private int grid_sn;

	private int row_no;

	private int height;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_grid_row";
	public static final String[] primaryKeys = { "grid_sn", "row_no" };

}

package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GridColumn {
	public enum Fields { grid_sn, column_no, width }

	private int grid_sn;

	private int column_no;

	private int width;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_grid_column";
	public static final String[] primaryKeys = { "grid_sn", "column_no" };

}

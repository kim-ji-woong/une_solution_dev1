package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grid {
	public enum Fields { grid_sn, step_memb_sn }

	private int grid_sn;

	private int step_memb_sn;

	public static final String autoIncreaseField = "grid_sn";
	public static final String tableName = "so_compn_grd";
	public static final String[] primaryKeys = { "grid_sn" };

}

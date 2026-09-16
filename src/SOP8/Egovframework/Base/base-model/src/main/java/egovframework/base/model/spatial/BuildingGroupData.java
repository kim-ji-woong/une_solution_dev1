package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingGroupData {
	public enum Fields { buld_group_sn, ordr_indx, value, wdt, indent_level }

	private int buld_group_sn;

	private int ordr_indx;

	@NonNull
	@Builder.Default
	private String value = "";

	private boolean wdt;

	private Integer indent_level;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_buld_group_data";
	public static final String[] primaryKeys = { "buld_group_sn", "ordr_indx" };

}

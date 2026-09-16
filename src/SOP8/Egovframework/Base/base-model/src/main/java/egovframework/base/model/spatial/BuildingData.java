package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingData {
	public enum Fields { buld_sn, ordr_indx, value, wdt, indent_level }

	private int buld_sn;

	private int ordr_indx;

	@NonNull
	@Builder.Default
	private String value = "";

	private boolean wdt;

	private Integer indent_level;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_buld_data";
	public static final String[] primaryKeys = { "buld_sn", "ordr_indx" };

}

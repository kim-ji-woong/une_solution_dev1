package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialLimitData {
	public enum Fields { sensor_zone_sn, lim_indx, usab, value }

	private int sensor_zone_sn;

	private int lim_indx;

	private boolean usab;

	private Double value;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_material_lim_data";
	public static final String[] primaryKeys = { "sensor_zone_sn", "lim_indx" };

}

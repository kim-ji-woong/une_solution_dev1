package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {
	public enum Fields { sensor_zone_sn, cur_data, lim_bas, sensor_lim_ty_optn_code, sensor_lim_ty }

	private int sensor_zone_sn;

	private String cur_data;

	private Double lim_bas;

	private Integer sensor_lim_ty_optn_code;

	private Integer sensor_lim_ty;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_material";
	public static final String[] primaryKeys = { "sensor_zone_sn" };

}

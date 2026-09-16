package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sensor {
	public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_name, lc_name, x, y, z, zone_sn, site_sn, sensor_sttus_optn_code, sensor_sttus_code, enab, deleted }

	private int sensor_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	@NonNull
	@Builder.Default
	private String sensor_name = "";

	private String lc_name;

	private Double x;

	private Double y;

	private Double z;

	private Integer zone_sn;

	private int site_sn;

	private Integer sensor_sttus_optn_code;

	private Integer sensor_sttus_code;

	private boolean enab;

	private boolean deleted;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor";
	public static final String[] primaryKeys = { "sensor_sn", "sensor_ty_optn_code", "sensor_ty_code" };

}

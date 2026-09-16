package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorSensorZone {
	public enum Fields { sensor_zone_sn, sensor_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, unq_key, eqp_zone_sn, alarm_yn, tag_no, acti, sensor_server_sn, descp }

	private int sensor_zone_sn;

	private int sensor_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private Integer sensor_sub_ty_no;

	@NonNull
	@Builder.Default
	private String unq_key = "";

	private Integer eqp_zone_sn;

	private boolean alarm_yn;

	private Integer tag_no;

	private boolean acti;

	private Integer sensor_server_sn;

	private String descp;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_zone";
	public static final String[] primaryKeys = { "sensor_zone_sn" };

}

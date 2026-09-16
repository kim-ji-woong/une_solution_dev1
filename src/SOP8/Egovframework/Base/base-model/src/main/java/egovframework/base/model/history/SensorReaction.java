package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReaction {
	public enum Fields { sensor_react_hist_sn, sensor_zone_hist_sn, react_ty_optn_code, react_ty_code, tm, mssage, zone_sn, eqp_zone_sn, sensor_zone_sn, sensor_value, user_sn, alarm_level }

	private int sensor_react_hist_sn;

	private int sensor_zone_hist_sn;

	private int react_ty_optn_code;

	private int react_ty_code;

	@NonNull
	@Builder.Default
	private LocalDateTime tm = LocalDateTime.now();

	private String mssage;

	private Integer zone_sn;

	private Integer eqp_zone_sn;

	private Integer sensor_zone_sn;

	private String sensor_value;

	private Integer user_sn;

	private Integer alarm_level;

	public static final String autoIncreaseField = "sensor_react_hist_sn";
	public static final String tableName = "his_sensor_react";
	public static final String[] primaryKeys = { "sensor_react_hist_sn" };

}

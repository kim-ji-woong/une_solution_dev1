package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorZoneDetail {
	public enum Fields { sensor_zone_hist_sn, sensor_zone_sn, tm }

	private int sensor_zone_hist_sn;

	private int sensor_zone_sn;

	private LocalDateTime tm;

	public static final String autoIncreaseField = null;
	public static final String tableName = "his_sensor_zone_detail";
	public static final String[] primaryKeys = { "sensor_zone_hist_sn", "sensor_zone_sn" };

}

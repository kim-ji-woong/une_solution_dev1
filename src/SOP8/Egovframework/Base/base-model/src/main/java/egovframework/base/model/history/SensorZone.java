package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorZone {
	public enum Fields { sensor_zone_hist_sn, tm, zone_sn, sensor_ty_optn_code, sensor_ty_code, detct_sttus_optn_code, detct_sttus_code, memo, site_sn, reportr }

	private int sensor_zone_hist_sn;

	@NonNull
	@Builder.Default
	private LocalDateTime tm = LocalDateTime.now();

	private Integer zone_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private Integer detct_sttus_optn_code;

	private Integer detct_sttus_code;

	private String memo;

	private int site_sn;

	private String reportr;

	public static final String autoIncreaseField = "sensor_zone_hist_sn";
	public static final String tableName = "his_sensor_zone";
	public static final String[] primaryKeys = { "sensor_zone_hist_sn" };

}

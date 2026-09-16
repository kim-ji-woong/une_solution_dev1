package egovframework.base.model.alarm;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Current {
	public enum Fields { sensor_zone_hist_sn, sensor_zone_sn, detct_ty_optn_code, detct_ty_code, alarm_tm, sop_sttus_optn_code, sop_sttus_code, alarm_level, user_sn }

	private int sensor_zone_hist_sn;

	private int sensor_zone_sn;

	private int detct_ty_optn_code;

	private int detct_ty_code;

	@NonNull
	@Builder.Default
	private LocalDateTime alarm_tm = LocalDateTime.now();

	private int sop_sttus_optn_code;

	private int sop_sttus_code;

	private int alarm_level;

	private Integer user_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "al_cur";
	public static final String[] primaryKeys = { "sensor_zone_hist_sn", "sensor_zone_sn" };

}

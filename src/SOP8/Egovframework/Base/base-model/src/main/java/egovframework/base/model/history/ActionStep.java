package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionStep {
	public enum Fields { action_step_hist_sn, action_step_sn, begin_time, end_time, last_acces_time, detct_end_time, detct_time, lc, user_sn, sop_optn, sensor_zone_hist_sn, descp }

	private int action_step_hist_sn;

	private int action_step_sn;

	@NonNull
	@Builder.Default
	private LocalDateTime begin_time = LocalDateTime.now();

	private LocalDateTime end_time;

	private LocalDateTime last_acces_time;

	private LocalDateTime detct_end_time;

	private LocalDateTime detct_time;

	private String lc;

	private Integer user_sn;

	private String sop_optn;

	private Integer sensor_zone_hist_sn;

	private String descp;

	public static final String autoIncreaseField = "action_step_hist_sn";
	public static final String tableName = "his_action_step";
	public static final String[] primaryKeys = { "action_step_hist_sn" };

}

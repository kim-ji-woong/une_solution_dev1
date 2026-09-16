package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Component {
	public enum Fields { compn_hist_sn, action_step_hist_sn, compn_sn, time, sop_sttus_optn_code, sop_sttus_code, compt_cnt, user_sn, descp }

	private int compn_hist_sn;

	private int action_step_hist_sn;

	private int compn_sn;

	@NonNull
	@Builder.Default
	private LocalDateTime time = LocalDateTime.now();

	private int sop_sttus_optn_code;

	private int sop_sttus_code;

	private Integer compt_cnt;

	private Integer user_sn;

	private String descp;

	public static final String autoIncreaseField = "compn_hist_sn";
	public static final String tableName = "his_compn";
	public static final String[] primaryKeys = { "compn_hist_sn" };

}

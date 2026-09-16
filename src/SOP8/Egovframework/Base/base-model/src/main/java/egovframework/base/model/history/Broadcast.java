package egovframework.base.model.history;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Broadcast {
	public enum Fields { brdcst_hist_sn, text, siren_yn, brdcst_sttus_optn_code, brdcst_sttus_code, repit_cnt, requst_time, execut_time, site_sn }

	private int brdcst_hist_sn;

	@NonNull
	@Builder.Default
	private String text = "";

	private boolean siren_yn;

	private int brdcst_sttus_optn_code;

	private int brdcst_sttus_code;

	private int repit_cnt;

	@NonNull
	@Builder.Default
	private LocalDateTime requst_time = LocalDateTime.now();

	@NonNull
	@Builder.Default
	private LocalDateTime execut_time = LocalDateTime.now();

	private int site_sn;

	public static final String autoIncreaseField = "brdcst_hist_sn";
	public static final String tableName = "his_brdcst";
	public static final String[] primaryKeys = { "brdcst_hist_sn" };

}

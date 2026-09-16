package egovframework.base.model.weather;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Weekly {
	public enum Fields { wethr_site_sn, wethr_sttus_optn_code, oneday_after_tp, oneday_after_min_tp, oneday_after_wethr_sttus_code, twoday_after_tp, twoday_after_min_tp, twoday_after_wethr_sttus_code, thrday_after_tp, thrday_after_min_tp, thrday_after_wethr_sttus_code, fourday_after_tp, fourday_after_min_tp, fourday_after_wethr_sttus_code, fiveday_after_tp, fiveday_after_min_tp, fiveday_after_wethr_sttus_code, sixday_after_tp, sixday_after_min_tp, sixday_after_wethr_sttus_code, updt_tm }

	private int wethr_site_sn;

	private int wethr_sttus_optn_code;

	private double oneday_after_tp;

	private double oneday_after_min_tp;

	private int oneday_after_wethr_sttus_code;

	private double twoday_after_tp;

	private double twoday_after_min_tp;

	private int twoday_after_wethr_sttus_code;

	private double thrday_after_tp;

	private double thrday_after_min_tp;

	private int thrday_after_wethr_sttus_code;

	private double fourday_after_tp;

	private double fourday_after_min_tp;

	private int fourday_after_wethr_sttus_code;

	private double fiveday_after_tp;

	private double fiveday_after_min_tp;

	private int fiveday_after_wethr_sttus_code;

	private double sixday_after_tp;

	private double sixday_after_min_tp;

	private int sixday_after_wethr_sttus_code;

	@NonNull
	@Builder.Default
	private LocalDateTime updt_tm = LocalDateTime.now();

	public static final String autoIncreaseField = null;
	public static final String tableName = "wt_wkly";
	public static final String[] primaryKeys = { "wethr_site_sn" };

}

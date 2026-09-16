package egovframework.base.model.weather;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherCurrent {
	public enum Fields { wethr_site_sn, tp, sensb_tp, rain, hd, wind_spd, atm, updt_tm, wethr_sttus_optn_code, wethr_sttus_code, wind_drc_optn_code, wind_drc_code }

	private int wethr_site_sn;

	private double tp;

	private Double sensb_tp;

	private double rain;

	private double hd;

	private Double wind_spd;

	private Double atm;

	@NonNull
	@Builder.Default
	private LocalDateTime updt_tm = LocalDateTime.now();

	private Integer wethr_sttus_optn_code;

	private Integer wethr_sttus_code;

	private Integer wind_drc_optn_code;

	private Integer wind_drc_code;

	public static final String autoIncreaseField = null;
	public static final String tableName = "wt_cur";
	public static final String[] primaryKeys = { "wethr_site_sn" };

}

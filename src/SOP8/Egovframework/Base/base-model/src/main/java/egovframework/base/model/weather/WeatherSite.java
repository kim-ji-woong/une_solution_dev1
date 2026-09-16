package egovframework.base.model.weather;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherSite {
	public enum Fields { wethr_site_sn, name, descp }

	private int wethr_site_sn;

	@NonNull
	@Builder.Default
	private String name = "";

	private String descp;

	public static final String autoIncreaseField = null;
	public static final String tableName = "wt_site";
	public static final String[] primaryKeys = { "wethr_site_sn" };

}

package egovframework.base.model.common;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Site {
	public enum Fields { site_sn, site_name }

	private int site_sn;

	@NonNull
	@Builder.Default
	private String site_name = "";

	public static final String autoIncreaseField = null;
	public static final String tableName = "co_site";
	public static final String[] primaryKeys = { "site_sn" };

}

package egovframework.base.model.common;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonOption {
	public enum Fields { optn_sn, prop_name, site_sn, prop_value, descp }

	private int optn_sn;

	@NonNull
	@Builder.Default
	private String prop_name = "";

	private Integer site_sn;

	private String prop_value;

	private String descp;

	public static final String autoIncreaseField = "optn_sn";
	public static final String tableName = "co_sys_optn";
	public static final String[] primaryKeys = { "optn_sn" };

}

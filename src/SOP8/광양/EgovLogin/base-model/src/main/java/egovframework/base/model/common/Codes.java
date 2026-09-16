package egovframework.base.model.common;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Codes {
	public enum Fields { code, cl_code, code_name, ordr_no }

	private int code;

	private int cl_code;

	@NonNull
	@Builder.Default
	private String code_name = "";

	private int ordr_no;

	public static final String autoIncreaseField = null;
	public static final String tableName = "co_code";
	public static final String[] primaryKeys = { "code" };

}

package egovframework.base.model.common;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeClasses {
	public enum Fields { cl_code, ty_name, ty_eng_name }

	private int cl_code;

	@NonNull
	@Builder.Default
	private String ty_name = "";

	@NonNull
	@Builder.Default
	private String ty_eng_name = "";

	public static final String autoIncreaseField = null;
	public static final String tableName = "co_code_cl";
	public static final String[] primaryKeys = { "cl_code" };

}

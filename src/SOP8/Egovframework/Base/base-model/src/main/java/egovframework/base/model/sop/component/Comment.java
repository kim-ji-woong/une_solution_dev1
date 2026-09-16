package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
	public enum Fields { compn_sn, contents }

	private int compn_sn;

	@NonNull
	@Builder.Default
	private String contents = "";

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_cm";
	public static final String[] primaryKeys = { "compn_sn" };

}

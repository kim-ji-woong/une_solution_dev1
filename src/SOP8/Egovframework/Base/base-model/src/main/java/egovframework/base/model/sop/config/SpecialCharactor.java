package egovframework.base.model.sop.config;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialCharactor {
	public enum Fields { spcl_chrctr_sn, cl, contents, descp }

	private int spcl_chrctr_sn;

	@NonNull
	@Builder.Default
	private String cl = "";

	@NonNull
	@Builder.Default
	private String contents = "";

	private String descp;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_conf_spcl_chrctr";
	public static final String[] primaryKeys = { "spcl_chrctr_sn" };

}

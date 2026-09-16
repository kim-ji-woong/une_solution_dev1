package egovframework.base.model.account;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Option {
	public enum Fields { user_sn, optn_cl, optn_sclas, optn_indx, optn_value }

	private int user_sn;

	@NonNull
	@Builder.Default
	private String optn_cl = "";

	@NonNull
	@Builder.Default
	private String optn_sclas = "";

	private int optn_indx;

	private String optn_value;

	public static final String autoIncreaseField = null;
	public static final String tableName = "acc_optn";
	public static final String[] primaryKeys = { "user_sn", "optn_cl", "optn_sclas", "optn_indx" };

}

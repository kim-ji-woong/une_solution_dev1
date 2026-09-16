package egovframework.base.model.account;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {
	public enum Fields { grad_sn, grad_name }

	private int grad_sn;

	@NonNull
	@Builder.Default
	private String grad_name = "";

	public static final String autoIncreaseField = null;
	public static final String tableName = "acc_grad";
	public static final String[] primaryKeys = { "grad_sn" };

}

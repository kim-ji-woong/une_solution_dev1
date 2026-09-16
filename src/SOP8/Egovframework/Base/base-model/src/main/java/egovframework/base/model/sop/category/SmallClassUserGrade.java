package egovframework.base.model.sop.category;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmallClassUserGrade {
	public enum Fields { sclas_sn, grad_sn }

	private int sclas_sn;

	private int grad_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_ctgry_sclas_user_grad";
	public static final String[] primaryKeys = { "sclas_sn", "grad_sn" };

}

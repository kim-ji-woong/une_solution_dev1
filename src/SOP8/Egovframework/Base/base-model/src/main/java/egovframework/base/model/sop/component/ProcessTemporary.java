package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessTemporary {
	public enum Fields { compn_sn, tmpr_sn }

	private int compn_sn;

	private int tmpr_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_procs_tmpr";
	public static final String[] primaryKeys = { "compn_sn", "tmpr_sn" };

}

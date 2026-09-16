package egovframework.base.model.sop.component;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransmissionRegular {
	public enum Fields { compn_sn, rgl_sn }

	private int compn_sn;

	private int rgl_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "so_compn_trnsmis_rgl";
	public static final String[] primaryKeys = { "compn_sn", "rgl_sn" };

}

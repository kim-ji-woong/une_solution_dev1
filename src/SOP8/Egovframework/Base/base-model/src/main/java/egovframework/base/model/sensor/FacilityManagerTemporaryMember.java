package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityManagerTemporaryMember {
	public enum Fields { fclty_mgr_sn, tmpr_memb_sn }

	private int fclty_mgr_sn;

	private int tmpr_memb_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_fclty_mgr_tmpr_memb";
	public static final String[] primaryKeys = { "fclty_mgr_sn", "tmpr_memb_sn" };

}

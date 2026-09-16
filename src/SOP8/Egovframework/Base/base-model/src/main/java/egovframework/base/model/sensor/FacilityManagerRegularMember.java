package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityManagerRegularMember {
	public enum Fields { fclty_mgr_sn, rgl_memb_sn }

	private int fclty_mgr_sn;

	private int rgl_memb_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_fclty_mgr_rgl_memb";
	public static final String[] primaryKeys = { "fclty_mgr_sn", "rgl_memb_sn" };

}

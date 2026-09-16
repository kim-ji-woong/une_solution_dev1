package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityManagerRegular {
	public enum Fields { fclty_mgr_sn, rgl_sn }

	private int fclty_mgr_sn;

	private int rgl_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_fclty_mgr_rgl";
	public static final String[] primaryKeys = { "fclty_mgr_sn", "rgl_sn" };

}

package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityManager {
	public enum Fields { fclty_mgr_sn, sensor_ty_optn_code, sensor_ty_code, detct_ty_optn_code, detct_ty_code, site_sn, buld_group_sn, buld_sn, eqp_zone_sn }

	private int fclty_mgr_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private int detct_ty_optn_code;

	private int detct_ty_code;

	private Integer site_sn;

	private Integer buld_group_sn;

	private Integer buld_sn;

	private Integer eqp_zone_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_fclty_mgr";
	public static final String[] primaryKeys = { "fclty_mgr_sn" };

}

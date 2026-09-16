package egovframework.base.model.sensor.cctv;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipZoneCCTV {
	public enum Fields { eqp_zone_sn, cctv_1, cctv_2, cctv_3, cctv_4 }

	private int eqp_zone_sn;

	private Integer cctv_1;

	private Integer cctv_2;

	private Integer cctv_3;

	private Integer cctv_4;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_eqp_zone_cctv";
	public static final String[] primaryKeys = { "eqp_zone_sn" };

}

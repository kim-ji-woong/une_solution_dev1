package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentZoneLinkedZone {
	public enum Fields { eqp_zone_sn, zone_sn }

	private int eqp_zone_sn;

	private int zone_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_eqp_zone_link_zone";
	public static final String[] primaryKeys = { "eqp_zone_sn", "zone_sn" };

}

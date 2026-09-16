package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneData {
	public enum Fields { zone_sn, fake_wall_elev, poi_elev }

	private int zone_sn;

	private Double fake_wall_elev;

	private Double poi_elev;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_zone_data";
	public static final String[] primaryKeys = { "zone_sn" };

}

package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FakeWall {
	public enum Fields { fake_wall_sn, zone_sn, x, y, z, rtate, scale }

	private int fake_wall_sn;

	private int zone_sn;

	private double x;

	private double y;

	private double z;

	private double rtate;

	private double scale;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_fake_wall";
	public static final String[] primaryKeys = { "fake_wall_sn" };

}

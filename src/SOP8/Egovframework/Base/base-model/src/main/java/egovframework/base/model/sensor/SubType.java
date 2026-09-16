package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubType {
	public enum Fields { sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, sensor_sub_ty_name, uom, descp }

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private int sensor_sub_ty_no;

	@NonNull
	@Builder.Default
	private String sensor_sub_ty_name = "";

	private String uom;

	private String descp;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_sub_ty";
	public static final String[] primaryKeys = { "sensor_ty_optn_code", "sensor_ty_code", "sensor_sub_ty_no" };

}

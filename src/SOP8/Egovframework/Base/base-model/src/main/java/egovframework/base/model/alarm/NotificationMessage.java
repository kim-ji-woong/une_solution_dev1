package egovframework.base.model.alarm;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {
	public enum Fields { ntcn_sn, ntcn_name, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, mssage, detct_ty_optn_code, detct_ty_code, mssage_ty_optn_code, mssage_ty_code, acti }

	private int ntcn_sn;

	private String ntcn_name;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private Integer sensor_sub_ty_no;

	private Integer buld_group_sn;

	private Integer buld_sn;

	private Integer zone_sn;

	@NonNull
	@Builder.Default
	private String mssage = "";

	private int detct_ty_optn_code;

	private int detct_ty_code;

	private int mssage_ty_optn_code;

	private int mssage_ty_code;

	private boolean acti;

	public static final String autoIncreaseField = "ntcn_sn";
	public static final String tableName = "al_ntcn_mssage";
	public static final String[] primaryKeys = { "ntcn_sn" };

}

package egovframework.base.model.sensor;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServerInfo {
	public enum Fields { sensor_server_sn, lc, ip, port, cnnc_sttus, alarm_server_url, usab, sensor_server_ty_optn_code, sensor_server_ty_code, site_sn }

	private int sensor_server_sn;

	@NonNull
	@Builder.Default
	private String lc = "";

	@NonNull
	@Builder.Default
	private String ip = "";

	private Integer port;

	private Boolean cnnc_sttus;

	private String alarm_server_url;

	private Boolean usab;

	private int sensor_server_ty_optn_code;

	private int sensor_server_ty_code;

	private Integer site_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_sensor_server";
	public static final String[] primaryKeys = { "sensor_server_sn" };

}

package egovframework.base.model.sensor.cctv;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CCTV {
	public enum Fields { sensor_sn, sensor_ty_optn_code, sensor_ty_code, cctv_no, unq_key, indoor_yn, strmg_ty, chnnl, user_id, password, url, hd_url, ld_url, camera_ip, camera_makr_name, camera_model_name }

	private int sensor_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private int cctv_no;

	@NonNull
	@Builder.Default
	private String unq_key = "";

	private boolean indoor_yn;

	@NonNull
	@Builder.Default
	private String strmg_ty = "";

	private Integer chnnl;

	private String user_id;

	private String password;

	@NonNull
	@Builder.Default
	private String url = "";

	private String hd_url;

	private String ld_url;

	private String camera_ip;

	private String camera_makr_name;

	private String camera_model_name;

	public static final String autoIncreaseField = null;
	public static final String tableName = "fa_cctv";
	public static final String[] primaryKeys = { "sensor_sn" };

}

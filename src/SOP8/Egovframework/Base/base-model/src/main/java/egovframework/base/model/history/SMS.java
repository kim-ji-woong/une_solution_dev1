package egovframework.base.model.history;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SMS {
	public enum Fields { sms_hist_sn, sensor_zone_hist_sn, sensor_react_hist_sn, sms_contents, send_ty_optn_code, send_ty_code }

	private int sms_hist_sn;

	private Integer sensor_zone_hist_sn;

	private Integer sensor_react_hist_sn;

	private String sms_contents;

	private Integer send_ty_optn_code;

	private Integer send_ty_code;

	public static final String autoIncreaseField = "sms_hist_sn";
	public static final String tableName = "his_sms";
	public static final String[] primaryKeys = { "sms_hist_sn" };

}

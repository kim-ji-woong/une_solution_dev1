package egovframework.base.model.history;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SMSReceiver {
	public enum Fields { sms_hist_sn, rgl_memb_sn }

	private int sms_hist_sn;

	private int rgl_memb_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "his_sms_rcver";
	public static final String[] primaryKeys = { "sms_hist_sn", "rgl_memb_sn" };

}

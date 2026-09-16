package egovframework.base.model.alarm;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessageReceiver {
	public enum Fields { rcver_sn, ntcn_sn, rgl_sn, rgl_memb_sn, tmpr_sn, tmpr_memb_sn }

	private int rcver_sn;

	private int ntcn_sn;

	private Integer rgl_sn;

	private Integer rgl_memb_sn;

	private Integer tmpr_sn;

	private Integer tmpr_memb_sn;

	public static final String autoIncreaseField = "rcver_sn";
	public static final String tableName = "al_ntcn_mssage_rcver";
	public static final String[] primaryKeys = { "rcver_sn" };

}

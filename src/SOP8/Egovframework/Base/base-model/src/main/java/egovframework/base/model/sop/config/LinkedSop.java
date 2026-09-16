package egovframework.base.model.sop.config;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkedSop {
	public enum Fields { link_sop_sn, sensor_ty_optn_code, sensor_ty_code, sensor_sub_ty_no, buld_group_sn, buld_sn, zone_sn, lclas_sn, mclas_sn, site_sn, sclas_name, descp }

	private int link_sop_sn;

	private int sensor_ty_optn_code;

	private int sensor_ty_code;

	private Integer sensor_sub_ty_no;

	private Integer buld_group_sn;

	private Integer buld_sn;

	private Integer zone_sn;

	private int lclas_sn;

	private int mclas_sn;

	private int site_sn;

	@NonNull
	@Builder.Default
	private String sclas_name = "";

	private String descp;

	public static final String autoIncreaseField = "link_sop_sn";
	public static final String tableName = "so_conf_link_sop";
	public static final String[] primaryKeys = { "link_sop_sn" };

}

package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone {
	public enum Fields { zone_sn, name, buld_sn, floor_indx, adit_floor, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn }

	private int zone_sn;

	@NonNull
	@Builder.Default
	private String name = "";

	private Integer buld_sn;

	private Integer floor_indx;

	private Double adit_floor;

	private Double text_center_crdnt_x;

	private Double text_center_crdnt_y;

	private Double text_center_crdnt_z;

	private String brdcst_text;

	private String disp_text;

	private int site_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_zone";
	public static final String[] primaryKeys = { "zone_sn" };

}

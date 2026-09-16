package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentZone {
	public enum Fields { eqp_zone_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text, site_sn }

	private int eqp_zone_sn;

	@NonNull
	@Builder.Default
	private String name = "";

	private Double text_center_crdnt_x;

	private Double text_center_crdnt_y;

	private Double text_center_crdnt_z;

	private String brdcst_text;

	private String disp_text;

	private int site_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_eqp_zone";
	public static final String[] primaryKeys = { "eqp_zone_sn" };

}

package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingGroup {
	public enum Fields { buld_group_sn, name, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, disp_text, site_sn }

	private int buld_group_sn;

	@NonNull
	@Builder.Default
	private String name = "";

	private Double text_center_crdnt_x;

	private Double text_center_crdnt_y;

	private Double text_center_crdnt_z;

	private String disp_text;

	private int site_sn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_buld_group";
	public static final String[] primaryKeys = { "buld_group_sn" };

}

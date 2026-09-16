package egovframework.base.model.spatial;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Building {
	public enum Fields { buld_sn, buld_code, name, buld_group_sn, top_floor_indx, min_floor_indx, text_center_crdnt_x, text_center_crdnt_y, text_center_crdnt_z, brdcst_text, disp_text }

	private int buld_sn;

	private String buld_code;

	@NonNull
	@Builder.Default
	private String name = "";

	private int buld_group_sn;

	private int top_floor_indx;

	private int min_floor_indx;

	private Double text_center_crdnt_x;

	private Double text_center_crdnt_y;

	private Double text_center_crdnt_z;

	private String brdcst_text;

	private String disp_text;

	public static final String autoIncreaseField = null;
	public static final String tableName = "sp_buld";
	public static final String[] primaryKeys = { "buld_sn" };

}

package egovframework.base.model.history;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponentDetail {
	public enum Fields { compn_hist_detail_sn, compn_hist_sn, data_no, data_intgr, data_float, data_str }

	private int compn_hist_detail_sn;

	private int compn_hist_sn;

	private int data_no;

	private Integer data_intgr;

	private Double data_float;

	private String data_str;

	public static final String autoIncreaseField = "compn_hist_detail_sn";
	public static final String tableName = "his_compn_detail";
	public static final String[] primaryKeys = { "compn_hist_detail_sn" };

}

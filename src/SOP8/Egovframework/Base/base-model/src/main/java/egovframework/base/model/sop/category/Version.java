package egovframework.base.model.sop.category;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Version {
	public enum Fields { ver_sn, creat_de, last_acces_de, name, user_sn, site_sn, descp }

	private int ver_sn;

	@NonNull
	@Builder.Default
	private LocalDateTime creat_de = LocalDateTime.now();

	@NonNull
	@Builder.Default
	private LocalDateTime last_acces_de = LocalDateTime.now();

	@NonNull
	@Builder.Default
	private String name = "";

	private Integer user_sn;

	private int site_sn;

	private String descp;

	public static final String autoIncreaseField = "ver_sn";
	public static final String tableName = "so_ctgry_ver";
	public static final String[] primaryKeys = { "ver_sn" };

}

package egovframework.base.model.account;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"password", "password_salt"}) // (User 객체).ToString() 사용시 출력안할 필드 설정
@Builder
public class User {
	public enum Fields { user_sn, grad_sn, rgl_memb_sn, password, user_id, user_name, password_key, password_salt, site_sn, memo }

	private int user_sn;

	private int grad_sn;

	private Integer rgl_memb_sn;

	@NonNull
	@Builder.Default
	private String password = "";

	@NonNull
	@Builder.Default
	private String user_id = "";

	@NonNull
	@Builder.Default
	private String user_name = "";

	private String password_key;

	@NonNull
	@Builder.Default
	private String password_salt = "";

	private Integer site_sn;

	private String memo;

	public static final String autoIncreaseField = "user_sn";
	public static final String tableName = "acc_user";
	public static final String[] primaryKeys = { "user_sn" };

}

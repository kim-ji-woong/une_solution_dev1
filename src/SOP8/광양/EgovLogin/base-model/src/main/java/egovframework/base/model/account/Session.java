package egovframework.base.model.account;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
	public enum Fields { user_sn, session_key, creat_de, updt_de, atmc_login_yn }

	private int user_sn;

	@NonNull
	@Builder.Default
	private String session_key = "";

	@NonNull
	@Builder.Default
	private LocalDateTime creat_de = LocalDateTime.now();

	@NonNull
	@Builder.Default
	private LocalDateTime updt_de = LocalDateTime.now();

	private boolean atmc_login_yn;

	public static final String autoIncreaseField = null;
	public static final String tableName = "acc_session";
	public static final String[] primaryKeys = { "user_sn" };

}

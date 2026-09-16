package egovframework.base.model.page;

import lombok.*;

// Pagination을 위해 만든 가상의 VO 클래스
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagination {
    public enum Fields { rowIndex, totalCount }

    private int rowIndex;

    private int totalCount;

    public static final String autoIncreaseField = null;
    public static final String tableName = "pagination";
    public static final String[] primaryKeys = { "rowIndex" };
}

package egovframework.base.excelreport.models;

import org.apache.poi.ss.usermodel.CellStyle;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SheetData {

    private String sheetName = "";
    // 첫 번째 행의 데이터들
    // Key : ColumnIndex
    private Map<Integer, String> titles = new HashMap<>();
    private Map<Integer, CellStyle> titleStyles = new HashMap<>();
    // Key : ColumnIndex
    private Map<Integer, List<String>> columnDatas = new HashMap<>();
    // Value.Key : ColumnData Index
    private Map<Integer, Map<Integer, CellStyle>> cellStyles = new HashMap<>();
    private Integer titleRowHeight = null;
    // Key : ColumnIndex
    private Map<Integer, Integer> rowHeight = new HashMap<>();
    private Object tag = null;

    // Getter / Setter
    public String getSheetName() {
        return sheetName;
    }

    public void setSheetName(String sheetName) {
        this.sheetName = sheetName;
    }

    public Map<Integer, String> getTitles() {
        return titles;
    }

    public Map<Integer, CellStyle> getTitleStyles() {
        return titleStyles;
    }

    public Map<Integer, List<String>> getColumnDatas() {
        return columnDatas;
    }

    public Map<Integer, Map<Integer, CellStyle>> getCellStyles() {
        return cellStyles;
    }

    public Integer getTitleRowHeight() {
        return titleRowHeight;
    }

    public void setTitleRowHeight(Integer titleRowHeight) {
        this.titleRowHeight = titleRowHeight;
    }

    public Map<Integer, Integer> getRowHeight() {
        return rowHeight;
    }

    public Object getTag() {
        return tag;
    }

    public void setTag(Object tag) {
        this.tag = tag;
    }

    // 생성자
    public SheetData(String sheetName) {
        this.sheetName = sheetName;
    }
}
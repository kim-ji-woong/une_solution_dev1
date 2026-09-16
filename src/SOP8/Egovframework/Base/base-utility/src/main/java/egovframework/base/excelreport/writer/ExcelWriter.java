package egovframework.base.excelreport.writer;

import egovframework.base.excelreport.models.SheetData;
import org.apache.poi.hpsf.DocumentSummaryInformation;
import org.apache.poi.hpsf.SummaryInformation;
import org.apache.poi.hpsf.PropertySetFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;

import java.io.ByteArrayOutputStream;
import java.util.*;

public abstract class ExcelWriter {

    public enum TableHeaderMode {
        Left(1), Middle(2), Right(4);
        private final int value;
        TableHeaderMode(int value) { this.value = value; }
        public int getValue() { return value; }
    }

    public enum TableBodyRow {
        Top(1), Middle(2), Bottom(4);
        private final int value;
        TableBodyRow(int value) { this.value = value; }
        public int getValue() { return value; }
    }

    public ExcelWriter() {}

    public byte[] run(StringBuilder errorMessage) {
        try {
            errorMessage.setLength(0);
            HSSFWorkbook workbook = makeWorkbook();

            if (workbook == null) {
                return null;
            }

            Collection<SheetData> sheetDatas = readSheetDatas(workbook, errorMessage);

            if (sheetDatas == null) {
                System.err.println(errorMessage);
                return null;
            }

            writeSheetDatas(workbook, sheetDatas);

            byte[] bytes;
            try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                workbook.write(bos);
                bytes = bos.toByteArray();
            }
            workbook.close();
            return bytes;

        } catch (Exception e) {
            errorMessage.append(e.getMessage());
            return null;
        }
    }

    protected void writeSheetDatas(HSSFWorkbook workbook, Collection<SheetData> sheetDatas) {
        for (SheetData sheetData : sheetDatas) {
            Sheet sheet = workbook.createSheet(sheetData.getSheetName());

            if (sheet == null) continue;

            int nextRowIndex = writePrev(sheet, workbook);

            Row row = sheet.createRow(nextRowIndex);
            if (sheetData.getTitleRowHeight() != null) {
                row.setHeightInPoints(sheetData.getTitleRowHeight());
            }

            int min, max;
            int[] minMax = getMinMax(sheetData.getTitles());
            if (minMax == null) continue;

            min = minMax[0];
            max = minMax[1];

            for (int i = min; i <= max; i++) {
                String strTitle = sheetData.getTitles().get(i);
                if (strTitle != null) {
                    Cell cell = row.createCell(i);

                    CellStyle style = sheetData.getTitleStyles().get(i);
                    if (style != null) {
                        cell.setCellStyle(style);
                    }
                    cell.setCellValue(strTitle);
                }
            }

            Map<Integer, Row> rowMap = new HashMap<>();
            for (int i = min; i <= max; i++) {
                List<String> values = sheetData.getColumnDatas().get(i);
                if (values != null) {
                    for (int j = 0; j < values.size(); j++) {
                        Row dataRow = rowMap.computeIfAbsent(j, k -> sheet.createRow(k + 1 + nextRowIndex));

                        Integer rowHeight = sheetData.getRowHeight().get(j);
                        if (rowHeight != null) {
                            dataRow.setHeightInPoints(rowHeight);
                        }

                        Cell cell = dataRow.createCell(i);
                        String value = values.get(j);

                        Map<Integer, CellStyle> styleMap = sheetData.getCellStyles().get(i);
                        if (styleMap != null) {
                            CellStyle style = styleMap.get(j);
                            if (style != null) {
                                cell.setCellStyle(style);
                            }
                        }
                        if (value != null) {
                            cell.setCellValue(value);
                        }
                    }
                }
            }
            writePost(sheet, workbook);
        }
    }

    protected int[] getMinMax(Map<Integer, String> dicTitles) {
        int max = -1;
        int min = Integer.MAX_VALUE;

        for (Integer key : dicTitles.keySet()) {
            if (min > max) {
                min = max = key;
            } else {
                if (min > key) min = key;
                if (max < key) max = key;
            }
        }

        return (min <= max) ? new int[]{min, max} : null;
    }

    private HSSFWorkbook makeWorkbook() {
        String company = "유엔이";
        HSSFWorkbook workbook = new HSSFWorkbook();

        try {
            DocumentSummaryInformation dsi = PropertySetFactory.newDocumentSummaryInformation();
            dsi.setCompany(company);
            workbook.createInformationProperties();
            workbook.getDocumentSummaryInformation().setCompany(company);

            SummaryInformation si = workbook.getSummaryInformation();
            si.setSubject(getSubject());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return workbook;
    }

    protected abstract Collection<SheetData> readSheetDatas(HSSFWorkbook workbook, StringBuilder errorMessage);
    protected abstract String getSubject();

    public String getFileName() {
        return getFileName(getSubject());
    }

    protected String getFileName(String strTag) {
        Calendar cal = Calendar.getInstance();
        return String.format("%s_%d%02d%02d_%02d%02d%02d.xls",
                strTag,
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH) + 1,
                cal.get(Calendar.DAY_OF_MONTH),
                cal.get(Calendar.HOUR_OF_DAY),
                cal.get(Calendar.MINUTE),
                cal.get(Calendar.SECOND));
    }

    protected int writePrev(Sheet sheet, HSSFWorkbook workbook) {
        return 0;
    }

    protected void writePost(Sheet sheet, HSSFWorkbook workbook) {}

    // Utility methods for alignment flags
    protected static boolean isLeft(int mode) { return (mode & TableHeaderMode.Left.getValue()) == TableHeaderMode.Left.getValue(); }
    protected static boolean isHMiddle(int mode) { return (mode & TableHeaderMode.Middle.getValue()) == TableHeaderMode.Middle.getValue(); }
    protected static boolean isRight(int mode) { return (mode & TableHeaderMode.Right.getValue()) == TableHeaderMode.Right.getValue(); }
    protected static boolean isTop(int mode) { return (mode & TableBodyRow.Top.getValue()) == TableBodyRow.Top.getValue(); }
    protected static boolean isVMiddle(int mode) { return (mode & TableBodyRow.Middle.getValue()) == TableBodyRow.Middle.getValue(); }
    protected static boolean isBottom(int mode) { return (mode & TableBodyRow.Bottom.getValue()) == TableBodyRow.Bottom.getValue(); }
}
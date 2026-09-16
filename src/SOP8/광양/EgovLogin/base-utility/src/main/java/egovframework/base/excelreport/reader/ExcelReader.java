package egovframework.base.excelreport.reader;

import egovframework.base.excelreport.models.SheetData;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public abstract class ExcelReader {
    private String filePath = null;

    public ExcelReader(String filePath) {
        this.filePath = filePath;
    }

    public boolean run(Object parameter, StringBuilder errorMessage) {
        if (filePath == null) {
            errorMessage.append("filePath 값이 null");
            return false;
        }

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            List<SheetData> sheetDatas = new ArrayList<>();

            for (int sheetIndex = 0; sheetIndex < workbook.getNumberOfSheets(); sheetIndex++) {
                Sheet sheet = workbook.getSheetAt(sheetIndex);
                SheetData sheetData = new SheetData(sheet.getSheetName());
                sheetDatas.add(sheetData);

                boolean firstLine = true;
                DataFormatter formatter = new DataFormatter();

                for (Row row : sheet) {
                    int nFieldCount = row.getLastCellNum();

                    for (int i = 0; i < nFieldCount; i++) {
                        Cell cell = row.getCell(i);
                        String value = null;

                        if (cell != null) {
                            value = formatter.formatCellValue(cell);
                            /*cell.setCellType(CellType.STRING);
                            value = cell.getStringCellValue();*/
                        }

                        if (firstLine) {
                            sheetData.getTitles().put(i, value);
                        } else {
                            List<String> columnDatas = sheetData.getColumnDatas().computeIfAbsent(i, k -> new ArrayList<>());
                            columnDatas.add(value);
                        }
                    }
                    firstLine = false;
                }
            }

            return updateData(sheetDatas, parameter, errorMessage);

        } catch (IOException e) {
            errorMessage.append(e.getMessage());
            return false;
        } catch (Exception ex) {
            errorMessage.append(ex.getMessage());
            return false;
        }
    }

    protected int[] getColumnCounts(SheetData sheetData, int min, int max, int[] maxColumnCount) {
        int maxCount = 0;

        for (Map.Entry<Integer, List<String>> entry : sheetData.getColumnDatas().entrySet()) {
            int nColumnCount = entry.getValue().size();
            if (maxCount < nColumnCount) {
                maxCount = nColumnCount;
            }
        }
        maxColumnCount[0] = maxCount;

        if (min > max) {
            return null;
        }

        int[] arrColumnCount = new int[max - min + 1];
        for (int i = min; i <= max; i++) {
            List<String> datas = sheetData.getColumnDatas().get(i);
            arrColumnCount[i - min] = (datas != null) ? datas.size() : 0;
        }

        return arrColumnCount;
    }

    protected abstract boolean updateData(List<SheetData> sheetDatas, Object parameter, StringBuilder errorMessage);
}
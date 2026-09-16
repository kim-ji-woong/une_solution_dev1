package egovframework.base.history.ibll.models.history;

public class SensorAnalysisHistory implements Comparable<SensorAnalysisHistory> {

    private String sensorTypeName;
    private String sensorName;
    private String locationName;
    private int detectCount;
    private int malfunctionCount;
    private int sensorClearCount;
    private int userResetCount;
    private double malfunctionRatio;
    private double accumulationRatio;
    private int rowNo = -1;

    // Getters and Setters
    public String getSensorTypeName() {
        return sensorTypeName;
    }

    public void setSensorTypeName(String sensorTypeName) {
        this.sensorTypeName = sensorTypeName;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public int getDetectCount() {
        return detectCount;
    }

    public void setDetectCount(int detectCount) {
        this.detectCount = detectCount;
    }

    public int getMalfunctionCount() {
        return malfunctionCount;
    }

    public void setMalfunctionCount(int malfunctionCount) {
        this.malfunctionCount = malfunctionCount;
    }

    public int getSensorClearCount() {
        return sensorClearCount;
    }

    public void setSensorClearCount(int sensorClearCount) {
        this.sensorClearCount = sensorClearCount;
    }

    public int getUserResetCount() {
        return userResetCount;
    }

    public void setUserResetCount(int userResetCount) {
        this.userResetCount = userResetCount;
    }

    public double getMalfunctionRatio() {
        return malfunctionRatio;
    }

    public void setMalfunctionRatio(double malfunctionRatio) {
        this.malfunctionRatio = malfunctionRatio;
    }

    // ´©ÀûÅ½ÁöÀ²(%)
    public double getAccumulationRatio() {
        return accumulationRatio;
    }

    public void setAccumulationRatio(double accumulationRatio) {
        this.accumulationRatio = accumulationRatio;
    }

    public int getRowNo() {
        return rowNo;
    }

    public void setRowNo(int rowNo) {
        this.rowNo = rowNo;
    }

    // Compare by DetectCount (descending order)
    @Override
    public int compareTo(SensorAnalysisHistory other) {
        return Integer.compare(other.detectCount, this.detectCount);
    }
}
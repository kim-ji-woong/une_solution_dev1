package egovframework.base.history.ibll.models.history;

public class SensorTypeData {

    private int sensorTypeCode = -1;
    private Integer sensorSubTypeNo = null;
    private String sensorTypeName = "";

    public int getSensorTypeCode() {
        return sensorTypeCode;
    }

    public void setSensorTypeCode(int sensorTypeCode) {
        this.sensorTypeCode = sensorTypeCode;
    }

    public Integer getSensorSubTypeNo() {
        return sensorSubTypeNo;
    }

    public void setSensorSubTypeNo(Integer sensorSubTypeNo) {
        this.sensorSubTypeNo = sensorSubTypeNo;
    }

    public String getSensorTypeName() {
        return sensorTypeName;
    }

    public void setSensorTypeName(String sensorTypeName) {
        this.sensorTypeName = sensorTypeName;
    }

    public long getKey() {
        return makeKey(sensorTypeCode, sensorSubTypeNo);
    }

    public static long makeKey(int sensorTypeNo, Integer sensorSubTypeNo) {
        if (sensorSubTypeNo == null) {
            return (long) sensorTypeNo;
        }

        long hi = ((long) sensorTypeNo) << 32;
        long low = sensorSubTypeNo.longValue();
        return hi | low;
    }
}
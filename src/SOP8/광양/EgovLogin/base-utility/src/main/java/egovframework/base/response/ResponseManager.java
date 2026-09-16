package egovframework.base.response;

import java.util.List;
import egovframework.base.response.MessageResultListData;

public class ResponseManager {

    public static <T> MessageResultListData<T> makeResultList(List<T> datas, String errorMessage) {
        if (datas == null) {
            return new MessageResultListData<>(false, errorMessage);
        }

        MessageResultListData<T> response = new MessageResultListData<>(true, "");
        response.setDatas(datas);
        return response;
    }

    public static <T> MessageResultData<T> makeResult(T data, String errorMessage) {
        if (data == null) {
            return new MessageResultData<>(false, errorMessage);
        }

        MessageResultData<T> response = new MessageResultData<>(true, "");
        response.setData(data);
        return response;
    }
}
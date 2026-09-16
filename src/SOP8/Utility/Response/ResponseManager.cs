using System.Collections.Generic;

namespace Response
{
    public static class ResponseManager
    {
        public static MessageResultListData<T> MakeResultList<T>(IEnumerable<T> datas, string strErrorMessage)
        {
            if (datas == null)
                return new MessageResultListData<T>(false, strErrorMessage);

            MessageResultListData<T> response = new MessageResultListData<T>(true, "");
            response.Datas = datas;
            return response;
        }

        public static MessageResultData<T> MakeResult<T>(T data, string strErrorMessage)
        {
            if (data == null)
                return new MessageResultData<T>(false, strErrorMessage);

            MessageResultData<T> response = new MessageResultData<T>(true, "");
            response.Data = data;
            return response;
        }
    }
}

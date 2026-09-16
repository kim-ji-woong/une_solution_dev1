using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseCurrentParkingInfo : MessageResult
    {
        /// <summary>
        /// 당일 입차 건수
        /// </summary>
        public int EntryParkingNum { get; set; }
        /// <summary>
        /// 당일 출차 건수
        /// </summary>
        public int OutParkingNum { get; set; }
        /// <summary>
        /// 현재 주차 건수
        /// </summary>
        public int CurrentParkingNum { get; set; }

        public List<ParkingData> ParkingList { get; set; }
    }

    public class ParkingData
    {
        public enum Type { OUT = 0, ENTRY, USER_OUT }

        private static string TYPE_OUT = "출차";
        private static string TYPE_ENTRY = "입차";
        private static string TYPE_USER_OUT = "수동 출차";

        /// <summary>
        /// 주차 이력 일련번호
        /// </summary>
        public int ParkingHisNo { get; set; }
        /// <summary>
        /// 차량번호
        /// </summary>
        public string ParkngNo { get; set; }
        /// <summary>
        /// 입차 일시
        /// </summary>
        public DateTime ParkngTm { get; set; }
        /// <summary>
        /// 출차 일시
        /// </summary>
        public DateTime? ParkngOutTm { get; set; }
        /// <summary>
        /// 구분 (정기/방문)
        /// </summary>
        public bool CmmtktYn { get; set; }
        /// <summary>
        /// 상태 코드
        /// </summary>
        public int ParkngStateNo { get; set; }
        /// <summary>
        /// 상태 이름
        /// </summary>
        public string ParkngStatusNm { get; set; }

        public static string GetParkngStateString(int nStateNo)
        {
            string strParkngStateType = TYPE_OUT;

            if (nStateNo == (int)Type.ENTRY)
                strParkngStateType = TYPE_ENTRY;
            else if (nStateNo == (int)Type.USER_OUT)
                strParkngStateType = TYPE_USER_OUT;

            return strParkngStateType;
        }
    }

    public class ResponseParkingInfo : MessageResult
    {
        /// <summary>
        /// 주차 이력 일련번호
        /// </summary>
        public int ParkingHisNo { get; set; }
        /// <summary>
        /// 차량번호
        /// </summary>
        public string ParkngNo { get; set; }
        /// <summary>
        /// 입차 일시
        /// </summary>
        public DateTime ParkngTm { get; set; }
        /// <summary>
        /// 출차 일시
        /// </summary>
        public DateTime ParkngOutTm { get; set; }
        /// <summary>
        /// 구분 (정기/방문)
        /// </summary>
        public bool CmmtktYn { get; set; }
        /// <summary>
        /// 상태 코드
        /// </summary>
        public int ParkngStateNo { get; set; }
        /// <summary>
        /// 상태 이름
        /// </summary>
        public string ParkngStatusNm { get; set; }
    }
}

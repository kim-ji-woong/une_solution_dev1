using System;
using System.Collections.Generic;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseWishData
    {
        
    }
    
    public class ResponseTodayWorkList : MessageResult
    {
        public List<TodayWork> TodayWorkList { get; set; }
        
        public ResponseTodayWorkList() : base()
        {
            
        }
     
        public ResponseTodayWorkList(bool isSuccess, string message) : base(isSuccess, message)
        {
            
        }
        
    }

    public class ResponseCurrentWorkPermitData : MessageResult
    {
        public List<CurrentWorkPermit> CurrentWorkPermitList { get; set; }
        
        public ResponseCurrentWorkPermitData() : base()
        {
            
        }
        
        public ResponseCurrentWorkPermitData(bool isSuccess, string message) : base(isSuccess, message)
        {
            
        }
    }

    public class TodayWork
    {
        public int ID { get; set; }
        /// <summary>
        /// 장소 이름
        /// </summary>
        public string? PLACE_NAME { get; set; }
        /// <summary>
        /// 작업명
        /// </summary>
        public string PLAN_NAME { get; set; }
        /// <summary>
        /// 작업종류
        /// </summary>
        public string WORK_GBN { get; set; }
        /// <summary>
        /// 담당자
        /// </summary>
        public string WORK_ENTRANT_NAME { get; set; }
        /// <summary>
        /// 법인
        /// </summary>
        public string COMPANY_GBN { get; set; }
        /// <summary>
        /// 시작일
        /// </summary>
        public string SDATE { get; set; }
        /// <summary>
        /// 종료일
        /// </summary>
        public string EDATE { get; set; }
        /// <summary>
        /// 공사업체
        /// </summary>
        public string SUBCONTRACTOR_NAME { get; set; }
        /// <summary>
        /// 업체 책임자
        /// </summary>
        public string FIELD_MANAGER_NAME { get; set; }
        /// <summary>
        /// 작업 인원
        /// </summary>
        public int? FIELD_PEOPLE_NUM { get; set; }
        /// <summary>
        /// 공사주관부서
        /// </summary>
        public string APPR_DEPT1 { get; set; }
        /// <summary>
        /// 작업발생부서
        /// </summary>
        public string APPR_DEPT2 { get; set; }
        /// <summary>
        /// 공장그룹 ID
        /// </summary>
        public int BuildingGroupID { get; set; }
        /// <summary>
        /// 공장ID
        /// </summary>
        public int BuildingID { get; set; }
        /// <summary>
        /// 층 ID
        /// </summary>
        public int? ZoneID { get; set; }
        /// <summary>
        /// 공장그룹 NAME
        /// </summary>
        public string BuildingGroupName { get; set; }
        
        public int? FloorIndex { get; set; }
    }
    
    
    public class CurrentWorkPermit
    {
        public int GENERAL_CNT { get; set; }
        public int FIRE_CNT { get; set; }
        public int HIGH_CNT { get; set; }
        public int ELEC_CNT  { get; set; }
        public int CLOSENESS_CNT  { get; set; }
        public int CRANE_CNT { get; set; }
        public int DIGG_CNT { get; set; }
        public int RADI_CNT { get; set; }
        public int TOTAL_CNT { get; set; }
        public string PLANT_PRCS_ID { get; set; }
        public DateTime UpdateTime { get; set; }
        public string UpdateTimeString => UpdateTime.ToString("yyyy-MM-dd HH:mm:ss");
    }
}
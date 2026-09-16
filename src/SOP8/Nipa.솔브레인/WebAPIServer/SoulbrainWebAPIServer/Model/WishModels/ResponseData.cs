using System;
using System.Collections.Generic;

namespace SoulbrainWebAPIServer.Model
{
    public class ResponseData
    {
        
    }
    
    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }

    public class ResponseTodayWorkList : MessageResult
    {
        private List<TodayWork> m_todayWorkList = new List<TodayWork>();
        
        public List<TodayWork> TodayWorkList 
        {
            get { return m_todayWorkList; }
            set { m_todayWorkList = value; }
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

    public class ResponseCurrentWorkPermitData : MessageResult
    {
        private List<CurrentWorkPermit> m_currentWorkPermitList = new List<CurrentWorkPermit>();
        
        public List<CurrentWorkPermit> CurrentWorkPermitList 
        {
            get { return m_currentWorkPermitList; }
            set { m_currentWorkPermitList = value; }
        }
        
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
        
    }
}
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.Model.History
{
    public class Parking : Table
    {
        public enum Fields { parkng_hist_sn, parkng_tm, parkng_vhcle_no, parkng_entvhcl_yn, cmmtkt_yn, parkng_vhcle_image, user_yn };
        public enum WriteFields { parkng_tm, parkng_vhcle_no, parkng_entvhcl_yn, cmmtkt_yn, parkng_vhcle_image, user_yn };

        /// <summary>
        /// 주차 이력 일련번호
        /// </summary>
        public int parkng_hist_sn { get; set; }
        /// <summary>
        /// 주차 일시
        /// </summary>
        public DateTime parkng_tm { get; set; }
        /// <summary>
        /// 주차 차량번호
        /// </summary>
        public string parkng_vhcle_no { get; set; }
        /// <summary>
        /// 입차 여부
        /// </summary>
        public bool parkng_entvhcl_yn { get; set; }
        /// <summary>
        /// 정기권 여부
        /// </summary>
        public bool cmmtkt_yn { get; set; }
        /// <summary>
        /// 주차 차량 이미지
        /// </summary>
        public byte[] parkng_vhcle_image { get; set; }
        /// <summary>
        /// 사용자 생성 이력 여부
        /// </summary>
        public bool user_yn { get; set; }

        public static string TableName { get { return "his_parkng"; } }

        public override string GetTableName()
        {
            return TableName;
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public void FromCopy(Parking obj)
        {
            this.parkng_hist_sn = obj.parkng_hist_sn;
            this.parkng_tm = obj.parkng_tm;
            this.parkng_vhcle_no = obj.parkng_vhcle_no;
            this.parkng_entvhcl_yn = obj.parkng_entvhcl_yn;
            this.cmmtkt_yn = obj.cmmtkt_yn;
            this.parkng_vhcle_image = obj.parkng_vhcle_image;
            this.user_yn = obj.user_yn;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LampusTech
{
    class DBManager
    {
        private string m_connectionString = null;
        private const string PARTROL_TABLE = "PATROL_TBL";

        private const string COLUMN_PATROL_SEQ = "PATROL_SEQ";
        private const string COLUMN_DATE = "DATE";
        private const string COLUMN_RANGER_SEQ = "RANGER_SEQ";
        private const string COLUMN_RANGER_NM = "RANGER_NM";
        private const string COLUMN_COURSE_SEQ = "COURSE_SEQ";
        private const string COLUMN_COURSE_NM = "COURSE_NM";
        private const string COLUMN_PLACE_SEQ = "PLACE_SEQ";
        private const string COLUMN_PLACE_NM = "PLACE_NM";
        private const string COLUMN_STATUS_NM = "STATUS_NM";
        private const string COLUMN_CONTENT = "CONTENT";
        private const string COLUMN_LASTCYCLE = "LASTCYCLE";
        private const string COLUMN_SND_YN = "SND_YN";

        LampusTechManager m_parent = null;

        public DBManager(LampusTechManager parent, string strFilePath, string strID, string strPW)
        {
            m_parent = parent;

            // OLE DB 연결 문자열 생성 (구버전 Access 데이터베이스용)
            // Jet.OLEDB.4.0은 Access 97-2003 형식을 지원 (32비트 전용)
            m_connectionString = $@"Provider=Microsoft.Jet.OLEDB.4.0;
                                Data Source={strFilePath};
                                Jet OLEDB:Database Password={strPW};";
        }

        public List<PartrolDB> GetPartrolData(int nLastNo, int nLastCount, ref PartrolDB firstData, out string strErrorMessage)
        {
            strErrorMessage = "";
            List<PartrolDB> partrolDatas = new List<PartrolDB>();

            try
            {
                using (OleDbConnection connection = new OleDbConnection(m_connectionString))
                {
                    connection.Open();

                    // 테이블 데이터 읽기
                    string query = $"SELECT * FROM [{PARTROL_TABLE}]";
                    using (OleDbCommand cmd = new OleDbCommand(query, connection))
                    using (OleDbDataAdapter adapter = new OleDbDataAdapter(cmd))
                    {
                        DataTable tableData = new DataTable();
                        adapter.Fill(tableData);

                        if (tableData.Rows.Count == 0)
                            m_parent.Logger.Write($"데이터가 존재하지 않습니다.");
                        else if (tableData.Rows.Count == nLastCount)
                            m_parent.Logger.Write($"마지막 데이터 갯수와 동일합니다.");

                        nLastCount = tableData.Rows.Count;

                        // 데이터 행별로 출력
                        foreach (DataRow row in tableData.Rows)
                        {
                            try
                            {
                                PartrolDB partrol = new PartrolDB();
                                partrol.PATROL_SEQ = (int)row[COLUMN_PATROL_SEQ];

                                // 첫번째 데이터와 기존 첫번째 데이터와 비교하여 다르다면 초기화 경우로 다시 데이터 쌓기
                                if (firstData != null && partrol.PATROL_SEQ == 1)
                                {
                                    partrol.DATE = DateTime.Parse((string)row[COLUMN_DATE]);

                                    if (firstData.DATE != partrol.DATE)
                                    {
                                        // 파일 초기화로 인한 체크값 초기화
                                        firstData = null;
                                        nLastNo = 0;                                       
                                    }                                  
                                }

                                // 마지막 조회 값 이후로 데이터 가져오기
                                if (nLastNo > 0 && nLastNo >= partrol.PATROL_SEQ)
                                    continue;

                                partrol.DATE = DateTime.Parse((string)row[COLUMN_DATE]);

                                if (row[COLUMN_RANGER_NM] == null)
                                {
                                    partrol.RANGER_NM = null;
                                }
                                else
                                {
                                    partrol.RANGER_NM = (string)row[COLUMN_RANGER_NM];
                                }

                                partrol.COURSE_NM = (string)row[COLUMN_COURSE_NM];
                                partrol.PLACE_NM = (string)row[COLUMN_PLACE_NM];
                                partrol.LASTCYCLE = (bool)row[COLUMN_LASTCYCLE];

                                partrolDatas.Add(partrol);

                                m_parent.Logger.Write($"DATE: {partrol.DATE}, RANGER_NM: {partrol.RANGER_NM}, COURSE_NM: {partrol.COURSE_NM}, PLACE_NM: {partrol.PLACE_NM}, LASTCYCLE: {partrol.LASTCYCLE}");

                                if (firstData == null && partrol.PATROL_SEQ == 1)
                                {
                                    firstData = partrol;
                                }
                            }
                            catch(Exception ex)
                            {
                                m_parent.Logger.Write("GetPartrolData() foreach Exception : " + ex.Message);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                partrolDatas = null;
            }

            return partrolDatas;
        }

        public List<PartrolData> ParsingPartrolData(List<PartrolDB> partrolDatas, out string strErrorMessage)
        {
            strErrorMessage = "";
            List<PartrolData> partrols = new List<PartrolData>();

            PartrolData partrol = null;

            try
            {
                List<string> courseNames = null;

                foreach (PartrolDB partrolData in partrolDatas)
                {
                    if (partrol == null)
                    {
                        partrol = new PartrolData();
                        //partrol.COURSE_NM = partrolData.COURSE_NM;
                        partrol.RANGER_NM = partrolData.RANGER_NM;
                        partrol.courses = new List<PartrolCourse>();

                        courseNames = new List<string>();
                    }

                    PartrolCourse course = new PartrolCourse();
                    course.COURSE_NM = partrolData.COURSE_NM;
                    course.PLACE_NM = partrolData.PLACE_NM;
                    course.DATE = partrolData.DATE;
                    course.PATROL_SEQ = partrolData.PATROL_SEQ;

                    if (courseNames.Contains(partrolData.COURSE_NM) == false)
                    {
                        courseNames.Add(partrolData.COURSE_NM);
                    }

                    partrol.courses.Add(course);

                    // 마지막 경우
                    if (partrolData.LASTCYCLE == true)
                    {
                        partrol.DATE = partrolData.DATE;
                        partrols.Add(partrol);
                        partrol.COURSE_NM = string.Join(" / ", courseNames);

                        partrol = null;
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                partrols = null;
            }

            return partrols;
        }
    }


    class PartrolDB
    {
        public int PATROL_SEQ { get; set; }
        public DateTime DATE { get; set; }
        public string RANGER_NM { get; set; }
        public string COURSE_NM { get; set; }
        public string PLACE_NM { get; set; }
        public bool LASTCYCLE { get; set; }
    }

    class PartrolData
    {
        public DateTime DATE { get; set; }
        public string COURSE_NM { get; set; }
        public string RANGER_NM { get; set; }
        public List<PartrolCourse> courses { get; set; }
    }

    class PartrolCourse
    {
        public int PATROL_SEQ { get; set; }
        public string COURSE_NM { get; set; }
        public string PLACE_NM { get; set; }
        public DateTime DATE { get; set; }
    }
}

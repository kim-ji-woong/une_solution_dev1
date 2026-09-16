using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Soulbrain.Model.History;

namespace SoulbrainPlc.Process
{
    // 이력 데이터(먼지 측정, 집수정) 보관정책(retention)에 따라 오래된 데이터를 삭제한다.
    public class RetentionManager
    {
        private PlcManager m_parent = null;
        private int m_nRetentionDays = 730;
        private int m_nPurgeMaxChunksPerRun = 7;
        private string m_strBackupPath = null;
        private int m_nBackupRetentionDays = 1095;
        private bool m_bIndexesEnsured = false;

        public RetentionManager(PlcManager parent, int retentionDays, int purgeMaxChunksPerRun, string backupPath, int backupRetentionDays)
        {
            m_parent = parent;
            m_nRetentionDays = retentionDays;
            m_nPurgeMaxChunksPerRun = purgeMaxChunksPerRun;
            m_strBackupPath = backupPath;
            m_nBackupRetentionDays = backupRetentionDays;
        }

        public void PurgeOldData()
        {
            if (!m_bIndexesEnsured)
                EnsureIndexes();

            try
            {
                DateTime cutoff = DateTime.Today.AddDays(-m_nRetentionDays);

                PurgeDustMeasurement(cutoff);
                PurgeWaterGather(cutoff);
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[ERROR] PurgeOldData() : {e.Message}");
            }

            PurgeBackupFiles();
        }

        // 삭제(tm < cutoff) 성능을 위한 인덱스를 최초 1회 보장한다. MSSQL 문법을 사용하며,
        // 권한 부족/문법 불일치 등으로 실패하더라도 purge 자체는 계속 진행되어야 하므로 예외를 밖으로 전파하지 않는다.
        private void EnsureIndexes()
        {
            try
            {
                string strDdl =
                    $@"IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_{DustMeasurement.TableName}_tm' AND object_id = OBJECT_ID('{DustMeasurement.TableName}'))
    CREATE INDEX ix_{DustMeasurement.TableName}_tm ON {DustMeasurement.TableName} (tm);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_{WaterGather.TableName}_tm' AND object_id = OBJECT_ID('{WaterGather.TableName}'))
    CREATE INDEX ix_{WaterGather.TableName}_tm ON {WaterGather.TableName} (tm);";

                bool bSuccess = m_parent.DataManager.GetDBManager().Excute(strDdl, out string strErr);

                if (bSuccess)
                {
                    m_bIndexesEnsured = true;
                    m_parent.Logger.Write($@"[INFO] EnsureIndexes() : tm 인덱스 확인/생성 완료.");
                }
                else
                {
                    m_parent.Logger.Write($@"[WARN] EnsureIndexes() : 인덱스 생성 실패. err={strErr}");
                }
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[WARN] EnsureIndexes() : {e.Message}");
            }
        }

        private void PurgeDustMeasurement(DateTime cutoff)
        {
            string strCutoff = cutoff.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);

            try
            {
                DateTime? minTm = GetMinTm(DustMeasurement.TableName);
                string strBoundary = GetPurgeBoundary(minTm, cutoff);

                if (strBoundary == null)
                {
                    m_parent.Logger.Write($@"[INFO] PurgeOldData() : table={DustMeasurement.TableName}, cutoff={strCutoff}, 삭제 대상 없음.");
                    return;
                }

                bool bSuccess = m_parent.DataManager.GetDelete().Delete<DustMeasurement>($"tm < '{strBoundary}'", out string strErr);

                m_parent.Logger.Write($@"[INFO] PurgeOldData() : table={DustMeasurement.TableName}, cutoff={strCutoff}, boundary={strBoundary}, success={bSuccess}, err={strErr}");
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[ERROR] PurgeDustMeasurement() : {e.Message}");
            }
        }

        private void PurgeWaterGather(DateTime cutoff)
        {
            string strCutoff = cutoff.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);

            try
            {
                DateTime? minTm = GetMinTm(WaterGather.TableName);
                string strBoundary = GetPurgeBoundary(minTm, cutoff);

                if (strBoundary == null)
                {
                    m_parent.Logger.Write($@"[INFO] PurgeOldData() : table={WaterGather.TableName}, cutoff={strCutoff}, 삭제 대상 없음.");
                    return;
                }

                bool bSuccess = m_parent.DataManager.GetDelete().Delete<WaterGather>($"tm < '{strBoundary}'", out string strErr);

                m_parent.Logger.Write($@"[INFO] PurgeOldData() : table={WaterGather.TableName}, cutoff={strCutoff}, boundary={strBoundary}, success={bSuccess}, err={strErr}");
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[ERROR] PurgeWaterGather() : {e.Message}");
            }
        }

        // 백업(xlsx) 파일 보관정책(retention) 삭제. DB에서 삭제된 데이터의 유일한 복구 원본이므로 보관기간을 넉넉히 잡는다.
        // 파일 수정시각이 아닌 경로(연도 폴더 + 파일명)에서 날짜를 파싱한다. 백업 파일은 나중에 재생성/수정될 수 있어
        // 수정시각으로는 실제 데이터 날짜를 신뢰할 수 없기 때문이다.
        private void PurgeBackupFiles()
        {
            try
            {
                if (string.IsNullOrEmpty(m_strBackupPath) || !Directory.Exists(m_strBackupPath))
                    return;

                DateTime cutoff = DateTime.Today.AddDays(-m_nBackupRetentionDays);
                int nDeletedCount = 0;

                foreach (string strYearDir in Directory.GetDirectories(m_strBackupPath))
                {
                    string strYearName = Path.GetFileName(strYearDir);

                    if (strYearName.Length != 4 || !int.TryParse(strYearName, out _))
                        continue;

                    foreach (string strFilePath in Directory.GetFiles(strYearDir, "*.xlsx"))
                    {
                        string strFileName = Path.GetFileNameWithoutExtension(strFilePath);

                        if (strFileName.Length != 4)
                            continue;

                        string strDate = strYearName + strFileName;

                        if (!DateTime.TryParseExact(strDate, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dtFileDate))
                            continue;

                        if (dtFileDate < cutoff)
                        {
                            File.Delete(strFilePath);
                            nDeletedCount++;
                        }
                    }

                    if (Directory.Exists(strYearDir) && Directory.GetFileSystemEntries(strYearDir).Length == 0)
                        Directory.Delete(strYearDir);
                }

                if (nDeletedCount > 0)
                    m_parent.Logger.Write($@"[INFO] PurgeBackupFiles() : path={m_strBackupPath}, cutoff={cutoff:yyyy-MM-dd}, deletedCount={nDeletedCount}");
            }
            catch (Exception e)
            {
                m_parent.Logger.Write($@"[ERROR] PurgeBackupFiles() : {e.Message}");
            }
        }

        // 첫 실행 시 수년치 대량 삭제로 적재 스레드가 막히지 않도록, MIN(tm) 기준으로 하루 단위 청크 경계를 계산한다.
        // MIN(tm)이 cutoff보다 오래되었으면 MIN(tm) 날짜부터 최대 m_nPurgeMaxChunksPerRun일치만 삭제 경계로 잡고,
        // 잔여 기간이 청크 일수보다 작으면(cutoff에 근접하면) cutoff까지 한 번에 삭제한다.
        // 삭제할 데이터가 없으면 null을 반환한다.
        private string GetPurgeBoundary(DateTime? minTm, DateTime cutoff)
        {
            if (minTm == null || minTm.Value >= cutoff)
                return null;

            DateTime chunkBoundary = minTm.Value.Date.AddDays(m_nPurgeMaxChunksPerRun);
            DateTime boundary = chunkBoundary < cutoff ? chunkBoundary : cutoff;

            return boundary.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);
        }

        private DateTime? GetMinTm(string strTableName)
        {
            string strQuery = $@"SELECT MIN(tm) AS tm FROM {strTableName}";

            IEnumerable<dynamic> result = m_parent.DataManager.GetSelect().Select(strQuery, out string strErr);

            dynamic item = result?.FirstOrDefault();

            if (item == null || item.tm == null)
                return null;

            try
            {
                return (DateTime)item.tm;
            }
            catch
            {
                m_parent.Logger.Write($@"[ERROR] GetMinTm() : {item.tm} is not DateTime. Table={strTableName}");
                return null;
            }
        }
    }
}

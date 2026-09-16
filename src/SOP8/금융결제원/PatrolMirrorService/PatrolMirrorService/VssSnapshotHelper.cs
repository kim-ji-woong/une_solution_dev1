using System;
using System.IO;
using Alphaleonis.Win32.Vss;

namespace PatrolMirrorService
{
    /// <summary>
    /// VSS(Volume Shadow Copy Service) 스냅샷을 이용해 잠긴 파일을 복사하는 헬퍼.
    /// 대상 파일이 다른 프로세스에 의해 잠겨 있어도 스냅샷을 통해 일관된 사본을 읽을 수 있다.
    /// 관리자 권한 및 NTFS 볼륨이 필요하다.
    /// </summary>
    internal static class VssSnapshotHelper
    {
        /// <summary>
        /// VSS 스냅샷을 생성하여 원본 파일을 대상 경로로 복사한다.
        /// 복사 완료 후 스냅샷은 즉시 해제된다.
        /// </summary>
        /// <param name="sourceFullPath">복사할 원본 파일의 절대 경로</param>
        /// <param name="destFullPath">복사될 대상 파일의 절대 경로</param>
        public static void CopyViaSnapshot(string sourceFullPath, string destFullPath)
        {
            // 0. 입력 경로 정규화: 연속 separator(\\) 등을 표준 형태로 정리
            //    App.config에 `\\` 가 escape 의도로 잘못 적혀 있어도 안전하게 처리
            sourceFullPath = Path.GetFullPath(sourceFullPath);

            // 1. 원본 파일이 속한 볼륨 루트 추출 (예: "C:\")
            string volumeRoot = Path.GetPathRoot(sourceFullPath);

            IVssFactory factory = VssFactoryProvider.Default.GetVssFactory();

            using (IVssBackupComponents backup = factory.CreateVssBackupComponents())
            {
                // 2. 백업 컨텍스트 초기화
                //    selectComponents: false — Writer 메타데이터 수집 불필요
                //    VssSnapshotContext.Backup: 비영구적 스냅샷, 프로세스 종료 또는 명시적 삭제 시 해제
                backup.InitializeForBackup(null);
                backup.SetBackupState(false, true, VssBackupType.Full, false);
                backup.SetContext(VssSnapshotContext.Backup);

                // 3. 스냅샷 세트 구성
                Guid snapshotSetId = backup.StartSnapshotSet();
                Guid snapshotId = backup.AddToSnapshotSet(volumeRoot);

                // 4. 스냅샷 생성
                backup.PrepareForBackup();
                backup.DoSnapshotSet();

                try
                {
                    // 5. 스냅샷 디바이스 경로로 원본 경로 변환
                    //    예) \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy0\Program Files (x86)\...
                    VssSnapshotProperties props = backup.GetSnapshotProperties(snapshotId);
                    string snapshotDevice = props.SnapshotDeviceObject.TrimEnd('\\', '/');
                    string relativePath = sourceFullPath
                        .Substring(volumeRoot.TrimEnd('\\', '/').Length)
                        .TrimStart('\\', '/');
                    string pathInSnapshot = snapshotDevice + "\\" + relativePath;

                    // 6. 스냅샷에서 대상 경로로 복사 (기존 파일 덮어쓰기)
                    File.Copy(pathInSnapshot, destFullPath, overwrite: true);

                    // 7. 대상 파일의 LastWriteTime을 원본과 동기화
                    //    변경 감지 로직(m_lastCopiedWriteTimeUtc)이 원본 기준이므로 일관성 유지
                    DateTime srcWriteUtc = File.GetLastWriteTimeUtc(sourceFullPath);
                    File.SetLastWriteTimeUtc(destFullPath, srcWriteUtc);
                }
                finally
                {
                    // DoSnapshotSet 이후 예외 발생 시에도 스냅샷 세트 해제를 보장.
                    // BackupComplete 없이 DeleteSnapshotSet 로 직접 정리:
                    //   BackupComplete 는 Writer 협조 시 사용하는 신호이며, 호출 후엔
                    //   상태 머신이 Finalized 로 진입해 DeleteSnapshotSet 가 VSS_E_BAD_STATE 를 반환한다.
                    //   우리는 Writer 없는 단순 스냅샷 복사이므로 BackupComplete 를 생략한다.
                    backup.DeleteSnapshotSet(snapshotSetId, false);
                }
            }
        }
    }
}

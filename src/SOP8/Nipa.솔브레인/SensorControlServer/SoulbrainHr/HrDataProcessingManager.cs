using System;
using System.Collections.Generic;
using System.Text;
using Base.Model.Account;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using SoulbrainHr.Data;

namespace SoulbrainHr
{
    public class HrDataProcessingManager
    {
        private IDataManager m_dataManager = null;
        
        public HrDataProcessingManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }
        
        /// <summary>
        /// co_team_rgl 테이블 FK 제약조건에 해당하는 테이블의 컬럼이 Nullable인지 판단하여 NULL처리 하거나 해당 행 삭제 쿼리 추가
        /// </summary>
        /// <param name="rgl_sn"></param>
        /// <param name="fkInfos"></param>
        /// <param name="sbAllQuery"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public bool AddForeignKeyQuery(DataManager dbManager, int serialNum, List<UNEData.ForeignKeyInfo> fkInfos, ref StringBuilder sbAllQuery, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            
            // 이미 처리된 테이블을 추적하여 무한 루프 방지
            HashSet<string> processedTables = new HashSet<string>();
            
            return ProcessForeignKeyRecursive(dbManager, serialNum, fkInfos, ref sbAllQuery, processedTables, 0, out strErrorMessage);
        }

        
        /// <summary>
        /// 삭제 대상 데이터의 재귀적 FK 처리
        /// </summary>
        /// <param name="targetValue"></param>
        /// <param name="fkInfos"></param>
        /// <param name="sbAllQuery"></param>
        /// <param name="processedTables"></param>
        /// <param name="depth"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool ProcessForeignKeyRecursive(DataManager dbManager, int targetValue, List<UNEData.ForeignKeyInfo> fkInfos, ref StringBuilder sbAllQuery, HashSet<string> processedTables, int depth, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            
            // 재귀 깊이 제한 (순환 참조 방지)
            if (depth > 10)
            {
                strErrorMessage = "FK 처리 깊이가 너무 깊습니다. 순환 참조 가능성이 있습니다.";
                return false;
            }

            if (fkInfos == null || fkInfos.Count == 0)
                return true;
            
            foreach (UNEData.ForeignKeyInfo fkInfo in fkInfos)
            {
                string tableKey = $"{fkInfo.ParentTable}_{fkInfo.ParentColumn}";
                
                // 이미 처리된 테이블은 스킵
                if (processedTables.Contains(tableKey))
                    continue;
                    
                processedTables.Add(tableKey);
                
                if (fkInfo.IsNullable && fkInfo.ParentTable != User.TableName)
                {
                    // Nullable 컬럼은 NULL로 업데이트
                    string strUpdateQuery = $@"
                                                UPDATE {fkInfo.ParentTable}
                                                SET {fkInfo.ParentColumn} = NULL
                                                WHERE {fkInfo.ParentColumn} = {targetValue};";
                    
                    sbAllQuery.AppendLine(strUpdateQuery);
                }
                else
                {
                    // Not Nullable인 경우: 먼저 자식 테이블들의 FK 처리
                    List<UNEData.ForeignKeyInfo> childFkInfos = GetChildForeignKey(dbManager, fkInfo.ParentTable, out strErrorMessage);
                    
                    if (!string.IsNullOrEmpty(strErrorMessage))
                    {
                        continue;
                    }

                    if (childFkInfos.Count > 0)
                    {
                        // 삭제할 행들의 PK 값을 먼저 조회
                        List<object> primaryKeyValues = GetPrimaryKeyValues(dbManager, fkInfo.ParentTable, fkInfo.ParentColumn, targetValue, out strErrorMessage);

                        if (primaryKeyValues.Count == 0)
                        {
                            strErrorMessage = $"No PK for Table : {fkInfo.ParentTable}";
                            continue;
                        }
                        
                        if (!string.IsNullOrEmpty(strErrorMessage))
                        {
                            strErrorMessage = $@"Error occurred on Select PK: {fkInfo.ParentTable}";
                            continue;
                        }

                        // 각 PK 값에 대해 자식 FK들을 재귀적으로 처리
                        foreach (object pkValue in primaryKeyValues)
                        {
                            if (ProcessForeignKeyRecursive(dbManager,Convert.ToInt32(pkValue), childFkInfos, ref sbAllQuery, new HashSet<string>(processedTables), depth + 1, out strErrorMessage) == false)
                            {
                                return false;
                            }
                        }
                    }
                    
                    // 자식들 처리 후 현재 테이블의 행 삭제
                    string strDeleteQuery = $@"
                                                DELETE FROM {fkInfo.ParentTable}
                                                WHERE {fkInfo.ParentColumn} = {targetValue};";
                    
                    sbAllQuery.AppendLine(strDeleteQuery);
                    
                    //Logger.Instance.Write(LogTypes.Info, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"FK 참조 데이터 삭제: {fkInfo.ParentTable} (FK값: {targetValue})");
                }
                
            }
            
            return true;
        }

        
        /// <summary>
        /// 데이터 삭제시 FK 제약조건 테이블 정보 조회
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public List<UNEData.ForeignKeyInfo> GetForeignKeyInfo(DataManager dbManager, string tableName, string columnName, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
    
            string strQuery = @$"
                                SELECT 
                                    fk.name AS FK_Name,
                                    tp.name AS Parent_Table,
                                    cp.name AS Parent_Column,
                                    tr.name AS Referenced_Table,
                                    cr.name AS Referenced_Column,
                                    c.is_nullable AS Is_Nullable
                                FROM sys.foreign_keys fk
                                INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
                                INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
                                INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
                                INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
                                INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
                                INNER JOIN sys.columns c ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
                                WHERE tr.name = '{tableName}' 
                                AND cr.name = '{columnName}';
                                ";
    
            try
            {
                IEnumerable<dynamic> results = dbManager.GetSelect().Select(strQuery, out strErrorMessage);
                if (results == null)
                    return null;

                List<UNEData.ForeignKeyInfo> fkInfos = new List<UNEData.ForeignKeyInfo>();
        
                foreach (var result in results)
                {
                    fkInfos.Add(new UNEData.ForeignKeyInfo
                    {
                        ParentTable = result.Parent_Table,
                        ParentColumn = result.Parent_Column,
                        ReferencedTable = result.Referenced_Table,
                        ReferencedColumn = result.Referenced_Column,
                        IsNullable = result.Is_Nullable
                    });
                }
        
                return fkInfos;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }

        }
        
        public List<UNEData.ForeignKeyInfo> GetChildForeignKey(DataManager dbManager, string tableName, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            
            string strQuery = @$"
                                SELECT 
                                    fk.name AS FK_Name,
                                    tp.name AS Parent_Table,
                                    cp.name AS Parent_Column,
                                    tr.name AS Referenced_Table,
                                    cr.name AS Referenced_Column,
                                    c.is_nullable AS Is_Nullable
                                FROM sys.foreign_keys fk
                                INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
                                INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
                                INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
                                INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
                                INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
                                INNER JOIN sys.columns c ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
                                WHERE tr.name = '{tableName}';
                                ";
            
            try
            {
                IEnumerable<dynamic> results = dbManager.GetSelect().Select(strQuery, out strErrorMessage);
                if (results == null)
                    return new List<UNEData.ForeignKeyInfo>();

                List<UNEData.ForeignKeyInfo> fkInfos = new List<UNEData.ForeignKeyInfo>();
                
                foreach (var result in results)
                {
                    fkInfos.Add(new UNEData.ForeignKeyInfo
                    {
                        ParentTable = result.Parent_Table,
                        ParentColumn = result.Parent_Column,
                        ReferencedTable = result.Referenced_Table,
                        ReferencedColumn = result.Referenced_Column,
                        IsNullable = result.Is_Nullable
                    });
                }
                
                return fkInfos;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return new List<UNEData.ForeignKeyInfo>();
            }
        }
        
        private List<object> GetPrimaryKeyValues(DataManager dbManager, string tableName, string fkColumnName, int fkValue, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            List<object> pkValues = new List<object>();
    
            try
            {
                // 테이블의 Primary Key 컬럼명 조회
                string strPkQuery = @$"
                            SELECT c.COLUMN_NAME
                            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc 
                            JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu 
                                ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
                            JOIN INFORMATION_SCHEMA.COLUMNS c 
                                ON ccu.COLUMN_NAME = c.COLUMN_NAME 
                                AND ccu.TABLE_NAME = c.TABLE_NAME
                            WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY' 
                            AND tc.TABLE_NAME = '{tableName}';";
        
                dynamic pkResult = dbManager.GetSelect().SelectFirst(strPkQuery, out strErrorMessage);
                if (pkResult == null)
                {
                    strErrorMessage = $"PK 컬럼 조회 실패: {tableName}";
                    return pkValues;
                }
        
                string pkColumnName = pkResult.COLUMN_NAME;
        
                // 삭제될 행들의 PK 값들 조회
                string strDataQuery = $@"SELECT {pkColumnName} FROM {tableName} WHERE {fkColumnName} = {fkValue}";
        
                IEnumerable<dynamic> results = dbManager.GetSelect().Select(strDataQuery, out strErrorMessage);
                if (results != null)
                {
                    foreach (var result in results)
                    {
                        if (result == null)
                            continue;

                        if (result is IDictionary<string, object> row)
                        {
                            if (row.ContainsKey(pkColumnName) && row[pkColumnName] != null)
                                pkValues.Add(row[pkColumnName]);
                        }
                    }
                }
        
                return pkValues;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return pkValues;
            }
        }
    }
}
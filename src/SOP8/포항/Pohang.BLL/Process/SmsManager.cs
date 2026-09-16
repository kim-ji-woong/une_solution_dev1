using System;
using System.Linq;
using System.Text.RegularExpressions;
using Base.Model.History;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Pohang.IBLL.Request;
using Pohang.IBLL.Response;

namespace Pohang.BLL.Process
{
    public class SmsManager
    {
        private IDataManager m_dataManager = null;
        
        public SmsManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseConvertSpecialCharacters GetConvertSpecialCharacters(RequestConvertSpecialCharacters data)
        {
            
            if (String.IsNullOrEmpty(data.Message))
                return new ResponseConvertSpecialCharacters()
                {
                    ConvertedMessage = data.Message,
                    Success = false,
                    Message = "Wrong parameters."
                };

            var ash = m_dataManager.GetSelect().Select<ActionStep>($@"{ActionStep.Fields.action_step_hist_sn} = {data.ActionStepHistoryNo}", out string strErrorMessage);

            if (ash == null || !ash.Any()) // 컬렉션이 null이거나 비어있는지 함께 확인
                return new ResponseConvertSpecialCharacters()
                {
                    ConvertedMessage = data.Message,
                    Success = false,
                    Message = "Action step history data could not be retrieved."
                };

            // FirstOrDefault는 null을 반환할 수 있으므로 nullable로 선언합니다.
            ActionStep? actionStepHistory = ash.FirstOrDefault();

            if (actionStepHistory == null)
                return new ResponseConvertSpecialCharacters()
                {
                    ConvertedMessage = data.Message,
                    Success = false,
                    Message = "Action step history not found for the given number."
                };

            // 정규 표현식을 사용하여 변환 로직을 실행합니다.
            string convertedMessage = ConvertMessage(data.Message, actionStepHistory);

            return new ResponseConvertSpecialCharacters()
            {
                ConvertedMessage = convertedMessage,
                Success = true,
                Message = "Conversion successful."
            };
        }
        
        private string ConvertMessage(string message, ActionStep actionStepHistory)
        {
            string pattern = @"{\s*(time|location|material)\s*}";

            return Regex.Replace(message, pattern, (match) =>
            {
                string keyword = match.Groups[1].Value;

                switch (keyword.ToLower())
                {
                    case "time":
                        return (actionStepHistory.detct_time.HasValue ? actionStepHistory.detct_time.Value : DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss");

                    case "location":
                        return ConvertLocation(actionStepHistory);

                    case "material":
                        return ConvertMaterial(actionStepHistory);

                    default:
                        return match.Value;
                }
            }, RegexOptions.IgnoreCase);
        }


        private string ConvertLocation(ActionStep actionStepHistory)
        {
            if (actionStepHistory.sensor_zone_hist_sn.HasValue && actionStepHistory.sensor_zone_hist_sn > 0)
            {
                string strQuery = $@"SELECT
                                        ez.disp_text as location
                                    FROM fa_sensor_zone fsz
                                             JOIN sp_eqp_zone ez
                                                  ON ez.eqp_zone_sn = fsz.eqp_zone_sn
                                    WHERE fsz.sensor_zone_sn = (
                                        SELECT d.sensor_zone_sn
                                        FROM his_sensor_zone_detail d
                                                 INNER JOIN his_sensor_zone z
                                                            ON d.sensor_zone_hist_sn = z.sensor_zone_hist_sn
                                                 INNER JOIN his_action_step a
                                                            ON z.sensor_zone_hist_sn = a.sensor_zone_hist_sn
                                        WHERE a.action_step_hist_sn = {actionStepHistory.action_step_hist_sn.ToString()}
                                    );";
                
                var location = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
                
                return location.FirstOrDefault()?.location ?? actionStepHistory.lc;
            }

            return actionStepHistory.lc;
        }

        private string ConvertMaterial(ActionStep actionStepHistory)
        {
            string strQuery = $@"
                                SELECT
                                    sst.sensor_sub_ty_name
                                FROM fa_sensor_zone fsz
                                JOIN fa_sensor_sub_ty sst
                                ON sst.sensor_sub_ty_no = fsz.sensor_sub_ty_no
                                WHERE fsz.sensor_zone_sn = (
                                    SELECT d.sensor_zone_sn
                                    FROM his_sensor_zone_detail d
                                             INNER JOIN his_sensor_zone z
                                                        ON d.sensor_zone_hist_sn = z.sensor_zone_hist_sn
                                             INNER JOIN his_action_step a
                                                        ON z.sensor_zone_hist_sn = a.sensor_zone_hist_sn
                                    WHERE a.action_step_hist_sn = {actionStepHistory.action_step_hist_sn.ToString()}
                                );
                                ";
            
            var material = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            
            return material.FirstOrDefault()?.sensor_sub_ty_name ?? "알수없음";
        }
    }
}
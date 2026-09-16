
using System;
using System.Collections.Generic;
using System.Text;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinLogManager
    {
        private readonly YoungJinLogWriter m_logWriter;
        private readonly YoungJinArchiveManager m_archiveManager;
        private readonly YoungJinAuditLogManager m_auditLogManager;

        public YoungJinLogManager(string logRootPath)
        {
            m_logWriter = new YoungJinLogWriter(logRootPath);
            m_archiveManager = new YoungJinArchiveManager(m_logWriter);
            m_auditLogManager = new YoungJinAuditLogManager(logRootPath);
        }

        public void LogBatchStart(string batchId, string endpoint, string sender, int receiverCount, int timeoutMs)
        {
            Log("BATCH_START", new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["endpoint"] = endpoint,
                ["sender"] = sender,
                ["receiver_count"] = receiverCount.ToString(),
                ["timeout_ms"] = timeoutMs.ToString()
            });
        }

        public YoungJinAuditWriteResult WriteSuccessAudit(string batchId, string endpoint, string sender, string receiver, string requestBody, string responseBody, string httpStatus, long latencyMs, int receiverCount, string smsIndex, string result, string responseMessage, string responseShape, string parseWarning)
        {
            try
            {
                return m_auditLogManager.WriteSuccessAudit(batchId, endpoint, sender, receiver, requestBody, responseBody, httpStatus, latencyMs, receiverCount, smsIndex, result, responseMessage, responseShape, parseWarning);
            }
            catch (Exception ex)
            {
                LogAuditError(batchId, result, ex.Message);
                return YoungJinAuditWriteResult.Empty;
            }
        }

        public YoungJinAuditWriteResult WriteFailureAudit(string result, string batchId, string endpoint, string sender, string receiver, string requestBody, string responseBody, string httpStatus, long latencyMs, int receiverCount, string error)
        {
            try
            {
                return m_auditLogManager.WriteFailureAudit(result, batchId, endpoint, sender, receiver, requestBody, responseBody, httpStatus, latencyMs, receiverCount, error);
            }
            catch (Exception ex)
            {
                LogAuditError(batchId, result, ex.Message);
                return YoungJinAuditWriteResult.Empty;
            }
        }

        public void LogRecipientHttpFailure(string batchId, string receiver, string sender, string httpStatus, long latencyMs, string responseText, YoungJinAuditWriteResult auditResult = null)
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["receiver"] = receiver,
                ["sender"] = sender,
                ["result"] = "FAIL_HTTP",
                ["http_status"] = httpStatus,
                ["latency_ms"] = latencyMs.ToString(),
                ["response"] = responseText
            };

            AppendAuditFields(fields, auditResult);
            Log("RECIPIENT_RESULT", fields);
        }

        public void LogRecipientParseFailure(string batchId, string receiver, string sender, string httpStatus, long latencyMs, string parseError, string responseText, YoungJinAuditWriteResult auditResult = null)
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["receiver"] = receiver,
                ["sender"] = sender,
                ["result"] = "FAIL_PARSE",
                ["http_status"] = httpStatus,
                ["latency_ms"] = latencyMs.ToString(),
                ["error"] = parseError,
                ["response"] = responseText
            };

            AppendAuditFields(fields, auditResult);
            Log("RECIPIENT_RESULT", fields);
        }

        public void LogRecipientSuccess(string batchId, string receiver, string sender, string httpStatus, long latencyMs, string smsIndex, string responseMessage, string result, string responseShape, string parseWarning, YoungJinAuditWriteResult auditResult = null)
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["receiver"] = receiver,
                ["sender"] = sender,
                ["result"] = result,
                ["http_status"] = httpStatus,
                ["latency_ms"] = latencyMs.ToString()
            };

            if (string.IsNullOrWhiteSpace(smsIndex) == false)
                fields["sms_idx"] = smsIndex;

            if (string.IsNullOrWhiteSpace(responseMessage) == false)
                fields["response_message"] = responseMessage;

            if (string.IsNullOrWhiteSpace(responseShape) == false)
                fields["response_shape"] = responseShape;

            if (string.IsNullOrWhiteSpace(parseWarning) == false)
                fields["parse_warning"] = parseWarning;

            AppendAuditFields(fields, auditResult);
            Log("RECIPIENT_RESULT", fields);
        }

        public void LogRecipientTimeout(string batchId, string receiver, string sender, long latencyMs, int timeoutMs, string responseText, YoungJinAuditWriteResult auditResult = null)
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["receiver"] = receiver,
                ["sender"] = sender,
                ["result"] = "FAIL_TIMEOUT",
                ["latency_ms"] = latencyMs.ToString(),
                ["timeout_ms"] = timeoutMs.ToString(),
                ["error"] = "TIMEOUT_AMBIGUOUS",
                ["response"] = responseText
            };

            AppendAuditFields(fields, auditResult);
            Log("RECIPIENT_RESULT", fields);
        }

        public void LogRecipientException(string batchId, string receiver, string sender, long latencyMs, string result, string error, string httpStatus = "", string responseText = "", YoungJinAuditWriteResult auditResult = null)
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["receiver"] = receiver,
                ["sender"] = sender,
                ["result"] = result,
                ["latency_ms"] = latencyMs.ToString(),
                ["error"] = error
            };

            if (string.IsNullOrWhiteSpace(httpStatus) == false)
                fields["http_status"] = httpStatus;

            if (string.IsNullOrWhiteSpace(responseText) == false)
                fields["response"] = responseText;

            AppendAuditFields(fields, auditResult);
            Log("RECIPIENT_RESULT", fields);
        }

        public void LogBatchEnd(string batchId, string result, int receiverCount, int validReceiverCount, int successCount, int failCount, long elapsedMs, string error = "")
        {
            var fields = new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["result"] = result,
                ["receiver_count"] = receiverCount.ToString(),
                ["valid_receiver_count"] = validReceiverCount.ToString(),
                ["success_count"] = successCount.ToString(),
                ["fail_count"] = failCount.ToString(),
                ["elapsed_ms"] = elapsedMs.ToString()
            };

            if (string.IsNullOrWhiteSpace(error) == false)
                fields["error"] = error;

            Log("BATCH_END", fields);
        }

        public void LogError(string message)
        {
            Log("Error", message);
        }

        private void LogAuditError(string batchId, string result, string message)
        {
            Log("AUDIT_ERROR", new Dictionary<string, string>
            {
                ["batch_id"] = batchId,
                ["result"] = result,
                ["error"] = message
            });
        }

        private void AppendAuditFields(Dictionary<string, string> fields, YoungJinAuditWriteResult auditResult)
        {
            if (fields == null || auditResult == null)
                return;

            if (string.IsNullOrWhiteSpace(auditResult.AuditRelativePath) == false)
                fields["audit_path"] = auditResult.AuditRelativePath;

            if (string.IsNullOrWhiteSpace(auditResult.PayloadSha256) == false)
                fields["payload_sha256"] = auditResult.PayloadSha256;

            if (string.IsNullOrWhiteSpace(auditResult.ResponseSha256) == false)
                fields["response_sha256"] = auditResult.ResponseSha256;
        }

        private void Log(string category, string message)
        {
            DateTime now = DateTime.Now;
            m_logWriter.AppendLogLine(now, category, message);
            m_archiveManager.TryStartMonthlyArchive(now);
        }

        private void Log(string category, Dictionary<string, string> fields)
        {
            var messageBuilder = new StringBuilder();

            if (fields != null)
            {
                foreach (KeyValuePair<string, string> pair in fields)
                {
                    if (messageBuilder.Length > 0)
                        messageBuilder.Append(' ');

                    messageBuilder.Append(pair.Key);
                    messageBuilder.Append("=\"");
                    messageBuilder.Append(YoungJinLogWriter.Sanitize(pair.Value));
                    messageBuilder.Append('"');
                }
            }

            Log(category, messageBuilder.ToString());
        }
    }
}

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinAuditWriteResult
    {
        public static YoungJinAuditWriteResult Empty { get; } = new YoungJinAuditWriteResult();

        public string AuditRelativePath { get; set; } = "";
        public string PayloadSha256 { get; set; } = "";
        public string ResponseSha256 { get; set; } = "";
    }

    internal class YoungJinAuditLogManager
    {
        private readonly string m_logRootPath;
        private readonly YoungJinAuditWriter m_successWriter;
        private readonly YoungJinAuditWriter m_failureWriter;
        private readonly YoungJinAuditArchiveManager m_successArchiveManager;
        private readonly YoungJinAuditArchiveManager m_failureArchiveManager;

        public YoungJinAuditLogManager(string logRootPath)
        {
            m_logRootPath = logRootPath;

            string auditRootPath = Path.Combine(logRootPath, "audit");
            m_successWriter = new YoungJinAuditWriter(Path.Combine(auditRootPath, "success"), "yj_audit_success_");
            m_failureWriter = new YoungJinAuditWriter(Path.Combine(auditRootPath, "failure"), "yj_audit_failure_");
            m_successArchiveManager = new YoungJinAuditArchiveManager(m_successWriter);
            m_failureArchiveManager = new YoungJinAuditArchiveManager(m_failureWriter);
        }

        public YoungJinAuditWriteResult WriteSuccessAudit(
            string batchId,
            string endpoint,
            string sender,
            string receiver,
            string requestBody,
            string responseBody,
            string httpStatus,
            long latencyMs,
            int receiverCount,
            string smsIndex,
            string result,
            string responseMessage,
            string responseShape,
            string parseWarning)
        {
            return WriteAudit(
                result,
                batchId,
                endpoint,
                sender,
                receiver,
                requestBody,
                responseBody,
                httpStatus,
                latencyMs,
                receiverCount,
                smsIndex,
                "",
                responseMessage,
                responseShape,
                parseWarning);
        }

        public YoungJinAuditWriteResult WriteFailureAudit(
            string result,
            string batchId,
            string endpoint,
            string sender,
            string receiver,
            string requestBody,
            string responseBody,
            string httpStatus,
            long latencyMs,
            int receiverCount,
            string error)
        {
            return WriteAudit(
                result,
                batchId,
                endpoint,
                sender,
                receiver,
                requestBody,
                responseBody,
                httpStatus,
                latencyMs,
                receiverCount,
                "",
                error,
                "",
                "",
                "");
        }

        private YoungJinAuditWriteResult WriteAudit(
            string result,
            string batchId,
            string endpoint,
            string sender,
            string receiver,
            string requestBody,
            string responseBody,
            string httpStatus,
            long latencyMs,
            int receiverCount,
            string smsIndex,
            string error,
            string responseMessage,
            string responseShape,
            string parseWarning)
        {
            DateTime now = DateTime.Now;
            string payloadSha256 = ComputeSha256(requestBody);
            string responseSha256 = ComputeSha256(responseBody);

            JObject auditObject = new JObject
            {
                ["logged_at"] = now.ToString("o"),
                ["batch_id"] = batchId,
                ["result"] = result,
                ["endpoint"] = endpoint,
                ["sender"] = sender,
                ["receiver"] = receiver,
                ["receiver_count"] = receiverCount,
                ["http_status"] = httpStatus,
                ["latency_ms"] = latencyMs,
                ["payload_sha256"] = payloadSha256,
                ["response_sha256"] = responseSha256,
                ["request_body"] = requestBody ?? "",
                ["response_body"] = responseBody ?? ""
            };

            JToken requestJson = TryParseJson(requestBody);
            if (requestJson != null)
                auditObject["request_json"] = requestJson;

            JToken responseJson = TryParseJson(responseBody);
            if (responseJson != null)
                auditObject["response_json"] = responseJson;

            if (string.IsNullOrWhiteSpace(smsIndex) == false)
                auditObject["sms_idx"] = smsIndex;

            if (string.IsNullOrWhiteSpace(responseMessage) == false)
                auditObject["response_message"] = responseMessage;

            if (string.IsNullOrWhiteSpace(responseShape) == false)
                auditObject["response_shape"] = responseShape;

            if (string.IsNullOrWhiteSpace(parseWarning) == false)
                auditObject["parse_warning"] = parseWarning;

            if (string.IsNullOrWhiteSpace(error) == false)
                auditObject["error"] = error;

            string auditJson = auditObject.ToString(Formatting.Indented);
            bool isSuccess = result != null && result.StartsWith("SUCCESS", StringComparison.Ordinal);
            YoungJinAuditWriter writer = isSuccess ? m_successWriter : m_failureWriter;
            YoungJinAuditArchiveManager archiveManager = isSuccess ? m_successArchiveManager : m_failureArchiveManager;
            string auditFilePath = writer.WriteAuditFile(now, auditJson);
            archiveManager.TryStartMonthlyArchive(now);

            return new YoungJinAuditWriteResult
            {
                AuditRelativePath = GetRelativePath(auditFilePath),
                PayloadSha256 = payloadSha256,
                ResponseSha256 = responseSha256
            };
        }

        private string GetRelativePath(string fullPath)
        {
            if (string.IsNullOrWhiteSpace(fullPath))
                return "";

            if (fullPath.StartsWith(m_logRootPath, StringComparison.OrdinalIgnoreCase))
            {
                return fullPath.Substring(m_logRootPath.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            }

            return fullPath;
        }

        private static JToken TryParseJson(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return null;

            try
            {
                return JToken.Parse(text);
            }
            catch
            {
                return null;
            }
        }

        private static string ComputeSha256(string value)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(value ?? "");
                byte[] hashBytes = sha256.ComputeHash(bytes);
                StringBuilder builder = new StringBuilder(hashBytes.Length * 2);

                foreach (byte hashByte in hashBytes)
                {
                    builder.Append(hashByte.ToString("x2"));
                }

                return builder.ToString();
            }
        }
    }
}

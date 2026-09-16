using System;
using Base.Model.Common;
using Base.Model.History;
using System.Collections.Generic;

namespace Base.SOPSimulator.BLL.Models
{
    // SOP가 일정시간이 지나면 자동종료할 것인지에 대한 옵션
    class SOPWaitTimeOption
    {
        public const string PropertyName = "SOP/AutoClose";
        public const string DefaultPropertyName = "Default/SOP/AutoClose";
        public enum CategoryTypes { None = -1, Fire = 0, PSM, Etc };
        public enum EndOptions { AutoClose = 0, ConfirmNClose, NoClose };
        public enum TimeOptions { Second = 0, Minute, Hour };

        private int? m_siteNo = null;
        private int m_nSeconds = -1;
        private CategoryTypes m_categoryType = CategoryTypes.None;
        private EndOptions m_endOption = EndOptions.NoClose;
        private TimeOptions m_timeOption = TimeOptions.Second;
        private bool m_isValid = true;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int Seconds
        {
            get { return m_nSeconds; }
            set { m_nSeconds = value; }
        }

        public CategoryTypes CategoryType
        {
            get { return m_categoryType; }
            set { m_categoryType = value; }
        }

        public EndOptions EndOption
        {
            get { return m_endOption; }
            set { m_endOption = value; }
        }

        public TimeOptions TimeOption
        {
            get { return m_timeOption; }
            set { m_timeOption = value; }
        }

        public bool IsValid
        {
            get { return m_isValid; }
            set { m_isValid = value; }
        }

        public SOPWaitTimeOption(Option option = null)
        {
            if (option != null)
                m_isValid = SetOption(option);
        }

        private bool SetOption(Option option)
        {
            int seconds;
            TimeOptions timeOption;
            EndOptions endOption;

            if (GetOptionValue(option.prop_value, out seconds, out timeOption, out endOption) == false)
                return false;

            m_siteNo = option.site_sn;
            m_nSeconds = seconds;
            m_timeOption = timeOption;
            m_endOption = endOption;
            return true;
        }

        private bool GetOptionValue(string strValue, out int seconds, out TimeOptions timeOption, out EndOptions endOption)
        {
            seconds = -1;
            timeOption = TimeOptions.Second;
            endOption = EndOptions.NoClose;

            if (strValue == null)
                return false;

            string[] tokens = strValue.Split(';');

            if (tokens.Length < 3)
                return false;

            int timeValue, timeUnit, closeOption;

            if (int.TryParse(tokens[0].Trim(), out timeValue) == false ||
                int.TryParse(tokens[1].Trim(), out timeUnit) == false ||
                int.TryParse(tokens[2].Trim(), out closeOption) == false)
                return false;

            if (timeUnit == 0)
            {
                // 초
                seconds = timeValue;
                timeOption = TimeOptions.Second;
            }
            else if (timeUnit == 1)
            {
                // 분
                seconds = timeValue * 60;
                timeOption = TimeOptions.Minute;
            }
            else if (timeUnit == 2)
            {
                // 시간
                seconds = timeValue * 3600;
                timeOption = TimeOptions.Hour;
            }
            else
                return false;

            EndOptions? _endOption = null;

            foreach (EndOptions option in Enum.GetValues(typeof(EndOptions)))
            {
                if ((int)option == closeOption)
                {
                    _endOption = option;
                    break;
                }
            }

            if (_endOption == null)
                return false;

            endOption = (EndOptions)_endOption;
            return true;
        }

        public static bool IsAutoCloseOptionName(string propertyName)
        {
            if (propertyName == null)
                return false;

            if (string.Compare(propertyName, PropertyName, true) == 0)
                return true;

            return string.Compare(propertyName, DefaultPropertyName, true) == 0;
        }

        // SOP가 자동종료할 때가 되었는가?
        public static EndOptions CheckSopCloseOption(ActionStep actionStepHistory, SOPWaitTimeOption option, out SOPWaitTimeOption targetOption)
        {
            targetOption = option;

            if (option == null || option.IsValid == false)
                return EndOptions.NoClose;

            if (actionStepHistory.last_acces_time == null)
                return EndOptions.NoClose;

            if (option.EndOption == EndOptions.NoClose)
                return EndOptions.NoClose;

            int elapsedSeconds = (int)(DateTime.Now - (DateTime)actionStepHistory.last_acces_time).TotalSeconds;

            if (option.Seconds < elapsedSeconds)
                return option.EndOption;

            return EndOptions.NoClose;
        }
    }
}

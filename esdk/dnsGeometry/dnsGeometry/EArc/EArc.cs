namespace UnE.Geometry
{
    public abstract class EArc
    {
        public enum EArcType { EARC = 0, ARC };

        // Radian. 시작각도
        protected double m_dBeginAngle = 0.0;
        // Radin. 전체각도
        protected double m_dAngle = 0.0;
        // EArc의 시작점에서 끝점까지의 방향이 시계방향인가?
        protected bool m_isClockWise = false;
        // 완전한 타원인가?
        protected bool m_isClosed = false;

        public abstract EArcType GetType();

        /// <summary>
        /// 타원의 전체각도를 리턴한다.
        /// </summary>
        /// <returns>radian</returns>
        public double GetAngle()
        {
            return m_dAngle;
        }

        /// <summary>
        /// 타원의 시작각도를 리턴한다.
        /// </summary>
        /// <returns>radian</returns>
        public double GetBeginAngle()
        {
            return m_dBeginAngle;
        }

        /// <summary>
        /// 타원의 끝각도를 리턴한다.
        /// </summary>
        /// <returns>radian</returns>
        public double GetEndAngle()
        {
            if (m_isClosed)
                return m_dBeginAngle;

            double dEndAngle = m_isClockWise ? m_dBeginAngle - m_dAngle : m_dBeginAngle + m_dAngle;

            if (dEndAngle < 0.0)
                dEndAngle += Math._2PI();
            else if (dEndAngle > Math._2PI())
                dEndAngle -= Math._2PI();

            return dEndAngle;
        }

        /// <summary>
        /// EArc의 시작점에서 끝점까지의 방향이 시계방향인가?
        /// </summary>
        /// <returns></returns>
        public bool IsClockWise()
        {
            return m_isClockWise;
        }

        /// <summary>
        /// 완전한 타원인가?
        /// </summary>
        /// <returns></returns>
        public bool IsClosed()
        {
            return m_isClosed;
        }

        public void SetClosed(bool isClosed)
        {
            m_isClosed = isClosed;
        }

        public static double ValidAngle(double angle)
        {
            double _2pi = Math._2PI();

            if (angle < 0.0f)
            {
                int nCount = (int)(angle / _2pi);
                angle = angle - (nCount - 1) * _2pi;

                if (angle >= _2pi)
                    angle -= _2pi;
            }
            else if (angle > _2pi)
            {
                int nCount = (int)(angle / _2pi);
                angle -= _2pi * nCount;
            }

            return angle;
        }

        public bool CheckValidAngle(double angle)
        {
            if (!m_isClosed)
            {
                double dEndAngle = ValidAngle(GetEndAngle());
                double dBeginAngle = ValidAngle(GetBeginAngle());

                if (m_isClockWise)
                {
                    if (dBeginAngle > dEndAngle)
                    {
                        if (angle < dEndAngle - Math.HALF_TOLERANCE() || angle > dBeginAngle + Math.HALF_TOLERANCE())
                            return false;
                    }
                    else
                    {
                        if (angle > dBeginAngle + Math.HALF_TOLERANCE() && angle < dEndAngle - Math.HALF_TOLERANCE())
                            return false;
                    }
                }
                else
                {
                    if (dBeginAngle > dEndAngle)
                    {
                        if (angle > dEndAngle + Math.HALF_TOLERANCE() && angle < dBeginAngle - Math.HALF_TOLERANCE())
                            return false;
                    }
                    else
                    {
                        if (angle < dBeginAngle - Math.HALF_TOLERANCE() || angle > dEndAngle + Math.HALF_TOLERANCE())
                            return false;
                    }
                }
            }

            return true;
        }

        protected static double GetdoubleAngle(double beginAngle, double endAngle, bool isClockwise)
        {
            double angle = 0.0;

            if (isClockwise)
            {
                if (beginAngle > endAngle)
                    angle = beginAngle - endAngle;
                else
                    angle = Math._2PI() - (endAngle - beginAngle);
            }
            else
            {
                if (endAngle > beginAngle)
                    angle = endAngle - beginAngle;
                else
                    angle = Math._2PI() - (beginAngle - endAngle);
            }

            return angle;
        }

        protected static bool IsEqualRad(double angle1, double angle2)
        {
            return System.Math.Abs(angle1 - angle2) <= Math.COORD_TOLERANCE() ? true : false;
        }
    }
}

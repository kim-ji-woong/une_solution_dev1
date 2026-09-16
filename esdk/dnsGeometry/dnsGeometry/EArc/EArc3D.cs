namespace UnE.Geometry
{
    public class EArc3D : EArc
    {
        // EArc를 둘러싼 직사각형 영역
        protected Vertex3D m_vTL = new Vertex3D();
        protected Vertex3D m_vBL = new Vertex3D();
        protected Vertex3D m_vBR = new Vertex3D();
        protected Vertex3D m_vCenter = new Vertex3D();

        // x²/ a²+ y²/ b²= 1의 a
        // 직사각형 너비의 절반
        protected double m_dA = 0.0;
        // x²/ a²+ y²/ b²= 1의 b
        // 직사각형 높이의 절반
        protected double m_dB = 0.0;

        public EArc3D()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="vTL">타원이 존재하는 직사각형 영역의 좌측 상단 모서리</param>
        /// <param name="vBL">타원이 존재하는 직사각형 영역의 좌측 하단 모서리</param>
        /// <param name="vBR">타원이 존재하는 직사각형 영역의 우측 하단 모서리</param>
        /// <param name="dBeginAngle">radian. 타원의 시작 각도</param>
        /// <param name="dEArcAngle">radian. 타원의 전체 각도. dEArcAngle이 2PI 이상이면 완전한 타원이 된다.</param>
        /// <param name="isClockWise">타원의 진행방향이 시계방향인가?</param>
        public EArc3D(Vertex3D vTL, Vertex3D vBL, Vertex3D vBR, double dBeginAngle, double dEArcAngle, bool isClockWise)
        {
            SetEArc(vTL, vBL, vBR, dBeginAngle, dEArcAngle, isClockWise);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="vTL">타원이 존재하는 직사각형 영역의 좌측 상단 모서리</param>
        /// <param name="vBL">타원이 존재하는 직사각형 영역의 좌측 하단 모서리</param>
        /// <param name="vBR">타원이 존재하는 직사각형 영역의 우측 하단 모서리</param>
        /// <param name="dBeginAngle">radian. 타원의 시작 각도</param>
        /// <param name="dEArcAngle">radian. 타원의 전체 각도. dEArcAngle이 2PI 이상이면 완전한 타원이 된다.</param>
        /// <param name="isClockWise">타원의 진행방향이 시계방향인가?</param>
        public bool SetEArc(Vertex3D vTL, Vertex3D vBL, Vertex3D vBR, double dBeginAngle, double dEArcAngle, bool isClockWise)
        {
            if (System.Math.Abs(Math.GetAngle(vTL, vBL, vBR) - Math.HALF_PI()) > Math.HALF_TOLERANCE())
                return false;

            m_vTL.CopyFrom(vTL);
            m_vBL.CopyFrom(vBL);
            m_vBR.CopyFrom(vBR);

            m_dA = vBL.GetDistance(vBR) / 2;
            m_dB = vTL.GetDistance(vBL) / 2;

            m_dBeginAngle = dBeginAngle;
            m_dAngle = dEArcAngle;
            m_isClockWise = isClockWise;

            if (GetAngle() >= Math._2PI() - Math.HALF_TOLERANCE())
                SetClosed(true);
            else
                SetClosed(false);

            m_vCenter = (vTL + vBR) / 2;

            return true;
        }

        public Vertex3D GetTL()
        {
            return m_vTL;
        }

        public Vertex3D GetBL()
        {
            return m_vBL;
        }

        public Vertex3D GetBR()
        {
            return m_vBR;
        }

        public Vertex3D GetCenter()
        {
            return m_vCenter;
        }

        public double GetA()
        {
            return m_dA;
        }

        public double GetB()
        {
            return m_dB;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dAngle">radian</param>
        /// <param name="rVertex"></param>
        /// <returns>dAngle이 범위를 벗어나면 false를 리턴한다.</returns>
        public bool GetVertex(double dAngle, out Vertex3D rVertex)
        {
            return GetVertex(dAngle, out rVertex, true);
        }


        private bool GetVertex(double dAngle, out Vertex3D rVertex, bool angleCheck)
        {
            rVertex = new Vertex3D();

            double halfpi = Math.HALF_PI();
            double pi = Math.PI();
            double _3halfpi = Math._3HALF_PI();
            double _2pi = Math._2PI();

            if (dAngle < 0.0f)
            {
                int nCount = (int)(-dAngle / _2pi);
                dAngle += _2pi * (nCount + 1);
            }
            else if (dAngle > _2pi)
            {
                int nCount = (int)(dAngle / _2pi);
                dAngle -= _2pi * nCount;
            }

            if (angleCheck)
            {
                if (!CheckValidAngle(dAngle))
                    return false;
            }

            double a = GetA();
            double b = GetB();
            if (a < Math.HALF_TOLERANCE() || b < Math.HALF_TOLERANCE())
                return false;

            Vertex3D vTL = GetTL();
            Vertex3D vBL = GetBL();
            Vertex3D vBR = GetBR();

            Vertex3D vL = (vTL + vBL) / 2;
            Vertex3D vR = vL + vBR - vBL;
            Vertex3D vB = (vBL + vBR) / 2;
            Vertex3D vT = vB + vTL - vBL;

            if (dAngle <= Math.HALF_TOLERANCE() || dAngle >= (_2pi - Math.HALF_TOLERANCE()))
            {
                rVertex.CopyFrom(vR);
            }
            else if (dAngle >= (halfpi - Math.HALF_TOLERANCE()) &&
                dAngle <= (halfpi + Math.HALF_TOLERANCE()))
            {
                rVertex.CopyFrom(vT);
            }
            else if (dAngle >= (pi - Math.HALF_TOLERANCE()) &&
                dAngle <= (pi + Math.HALF_TOLERANCE()))
            {
                rVertex.CopyFrom(vL);
            }
            else if (dAngle >= (_3halfpi - Math.HALF_TOLERANCE()) &&
                dAngle <= (_3halfpi + Math.HALF_TOLERANCE()))
            {
                rVertex.CopyFrom(vB);
            }
            else
            {
                double dLengthX, dLengthY;

                if (dAngle < halfpi)
                {
                    double dTanData = System.Math.Tan(dAngle);

                    dLengthX = System.Math.Sqrt(1.0 / (1.0 / a / a + dTanData * dTanData / b / b));
                    dLengthY = System.Math.Sqrt(1.0 / (1.0 / a / a / dTanData / dTanData + 1.0 / b / b));
                }
                else if (dAngle < pi)
                {
                    double dTanData = System.Math.Tan(pi - dAngle);

                    dLengthX = -System.Math.Sqrt(1.0 / (1.0 / a / a + dTanData * dTanData / b / b));
                    dLengthY = System.Math.Sqrt(1.0 / (1.0 / a / a / dTanData / dTanData + 1.0 / b / b));
                }
                else if (dAngle < _3halfpi)
                {
                    double dTanData = System.Math.Tan(dAngle - pi);

                    dLengthX = -System.Math.Sqrt(1.0 / (1.0 / a / a + dTanData * dTanData / b / b));
                    dLengthY = -System.Math.Sqrt(1.0 / (1.0 / a / a / dTanData / dTanData + 1.0 / b / b));
                }
                else
                {
                    double dTanData = System.Math.Tan(_2pi - dAngle);

                    dLengthX = System.Math.Sqrt(1.0 / (1.0 / a / a + dTanData * dTanData / b / b));
                    dLengthY = -System.Math.Sqrt(1.0 / (1.0 / a / a / dTanData / dTanData + 1.0 / b / b));
                }

                Vertex3D vCenter = GetCenter();
                Vertex3D vResult = vCenter + (vR - vCenter) * dLengthX / a;
                vResult = vResult + (vT - vCenter) * dLengthY / b;

                rVertex.CopyFrom(vResult);
            }

            return true;
        }


        public override EArcType GetType()
        {
            return EArcType.EARC;
        }

        public Vertex3D GetBeginVertex()
        {
            Vertex3D v = new Vertex3D();
            GetVertex(m_dBeginAngle, out v, false);
            return v;
        }

        public Vertex3D GetEndVertex()
        {
            Vertex3D v = new Vertex3D();
            GetVertex(m_isClockWise ? m_dBeginAngle - m_dAngle : m_dBeginAngle + m_dAngle, out v, false);
            return v;
        }

        /// <summary>
        /// 타원의 바깥방향으로(outside가 true일때) dLen만큼 확대(outside가 false이면 축소) 시킨다.
        /// </summary>
        /// <param name="outside"></param>
        /// <param name="dLen"></param>
        /// <returns></returns>
        public EArc3D Offset(bool outside, double dLen)
        {
            EArc3D earc = new EArc3D();

            if (!outside)
                dLen = -dLen;

            Vertex3D vL = (m_vTL + m_vBL) / 2;
            Vertex3D vB = (m_vBL + m_vBR) / 2;

            vL = Math.GetLinearVertex(vL, m_vCenter, -dLen);
            vB = Math.GetLinearVertex(vB, m_vCenter, -dLen);

            earc.m_vBL = vL + vB - m_vCenter;
            earc.m_vBR = vB * 2 - earc.m_vBL;
            earc.m_vTL = vL * 2 - earc.m_vBL;
            earc.m_vCenter.CopyFrom(m_vCenter);

            earc.m_dBeginAngle = m_dBeginAngle;
            earc.m_dAngle = m_dAngle;
            earc.m_isClockWise = IsClockWise();
            earc.m_isClosed = IsClosed();
            m_dA = m_dA + dLen;
            m_dB = m_dB + dLen;

            return earc;
        }

        /// <summary>
        /// v1, v2, v3를 지나는 평면을 기준으로 현재의 EArc와 대칭되는 객체를 만들어 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="v3"></param>
        /// <param name="rResult"></param>
        /// <returns>v1, v2, v3가 평면을 구성하지 못할 경우 false를 리턴한다.</returns>
        public bool Mirror(Vertex3D v1, Vertex3D v2, Vertex3D v3, out EArc3D rResult)
        {
            rResult = null;

            double a, b, c, d;  // ax + by + cz + d = 0
            if (!Math.MakePlane(v1, v2, v3, out a, out b, out c, out d))
                return false;

            rResult = new EArc3D();

            return _Mirror(a, b, c, d, rResult);
        }

        private bool _Mirror(double a, double b, double c, double d, EArc3D rResult)
        {
            Vertex3D vTR = m_vTL + m_vBR - m_vBL;
            Vertex3D _vTR = Math.GetNearestVertex(vTR, a, b, c, d);
            Vertex3D _vBL = Math.GetNearestVertex(m_vBL, a, b, c, d);
            Vertex3D _vBR = Math.GetNearestVertex(m_vBR, a, b, c, d);

            // Mirror를 하면 좌우가 바뀌므로 왼쪽과 오른쪽을 바꾸어준다.
            rResult.m_vTL = _vTR * 2 - vTR;
            rResult.m_vBL = _vBR * 2 - m_vBR;
            rResult.m_vBR = _vBL * 2 - m_vBL;
            rResult.m_vCenter = (rResult.m_vTL + rResult.m_vBR) / 2;
            rResult.m_isClockWise = !m_isClockWise;
            rResult.m_isClosed = m_isClosed;
            rResult.m_dA = m_dA;
            rResult.m_dB = m_dB;
            rResult.m_dAngle = m_dAngle;

            if (m_dBeginAngle < Math.HALF_PI())
                rResult.m_dBeginAngle = Math.HALF_PI() + (Math.HALF_PI() - m_dBeginAngle);
            else if (m_dBeginAngle < Math.PI())
                rResult.m_dBeginAngle = Math.HALF_PI() - (m_dBeginAngle - Math.HALF_PI());
            else if (m_dBeginAngle < Math._3HALF_PI())
                rResult.m_dBeginAngle = Math._3HALF_PI() + (Math._3HALF_PI() - m_dBeginAngle);
            else// if (m_dBeginAngle < Math::_2PI())
                rResult.m_dBeginAngle = Math._3HALF_PI() - (m_dBeginAngle - Math._3HALF_PI());

            return true;
        }
    }
}

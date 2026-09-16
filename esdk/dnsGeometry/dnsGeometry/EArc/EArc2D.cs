namespace UnE.Geometry
{
    public class EArc2D : EArc
    {
        // EArc를 둘러싼 직사각형 영역
        protected Vertex2D m_vTL = new Vertex2D();
        protected Vertex2D m_vBL = new Vertex2D();
        protected Vertex2D m_vBR = new Vertex2D();
        protected Vertex2D m_vCenter = new Vertex2D();

        // x²/ a²+ y²/ b²= 1의 a
        // 직사각형 너비의 절반
        protected double m_dA = 0.0;
        // x²/ a²+ y²/ b²= 1의 b
        // 직사각형 높이의 절반
        protected double m_dB = 0.0;

        public EArc2D()
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
        public EArc2D(Vertex2D vTL, Vertex2D vBL, Vertex2D vBR, double dBeginAngle, double dEArcAngle, bool isClockWise)
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
        public bool SetEArc(Vertex2D vTL, Vertex2D vBL, Vertex2D vBR, double dBeginAngle, double dEArcAngle, bool isClockWise)
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

        public Vertex2D GetTL()
        {
            return m_vTL;
        }

        public Vertex2D GetBL()
        {
            return m_vBL;
        }

        public Vertex2D GetBR()
        {
            return m_vBR;
        }

        public Vertex2D GetCenter()
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
        public bool GetVertex(double dAngle, out Vertex2D rVertex)
        {
            return GetVertex(dAngle, out rVertex, true);
        }


        private bool GetVertex(double dAngle, out Vertex2D rVertex, bool angleCheck)
        {
            rVertex = new Vertex2D();

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

            Vertex2D vTL = GetTL();
            Vertex2D vBL = GetBL();
            Vertex2D vBR = GetBR();

            Vertex2D vL = (vTL + vBL) / 2;
            Vertex2D vR = vL + vBR - vBL;
            Vertex2D vB = (vBL + vBR) / 2;
            Vertex2D vT = vB + vTL - vBL;

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

                Vertex2D vCenter = GetCenter();
                Vertex2D vResult = vCenter + (vR - vCenter) * dLengthX / a;
                vResult = vResult + (vT - vCenter) * dLengthY / b;

                rVertex.CopyFrom(vResult);
            }

            return true;
        }


        public override EArcType GetType()
        {
            return EArcType.EARC;
        }

        public Vertex2D GetBeginVertex()
        {
            Vertex2D v = new Vertex2D();
            GetVertex(m_dBeginAngle, out v, false);
            return v;
        }

        public Vertex2D GetEndVertex()
        {
            Vertex2D v = new Vertex2D();
            GetVertex(m_isClockWise ? m_dBeginAngle - m_dAngle : m_dBeginAngle + m_dAngle, out v, false);
            return v;
        }

        /// <summary>
        /// 타원의 바깥방향으로(outside가 true일때) dLen만큼 확대(outside가 false이면 축소) 시킨다.
        /// </summary>
        /// <param name="outside"></param>
        /// <param name="dLen"></param>
        /// <returns></returns>
        public EArc2D Offset(bool outside, double dLen)
        {
            EArc2D earc = new EArc2D();

            if (!outside)
                dLen = -dLen;

            Vertex2D vL = (m_vTL + m_vBL) / 2;
            Vertex2D vB = (m_vBL + m_vBR) / 2;

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
        /// v1과 v2를 지나는 직선을 기준으로 현재의 EArc 객체와 대칭되는 객체를 만들어 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="rResult"></param>
        /// <returns>v1과 v2가 동일한 좌표일 경우 false를 리턴한다.</returns>
        public bool Mirror(Vertex2D v1, Vertex2D v2, out EArc2D rResult)
        {
            rResult = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            rResult = new EArc2D();

            Vertex2D vTR = m_vTL + m_vBR - m_vBL;
            Vertex2D _vTR = Math.GetNearestVertex(vTR, v1, v2, true);
            Vertex2D _vBL = Math.GetNearestVertex(m_vBL, v1, v2, true);
            Vertex2D _vBR = Math.GetNearestVertex(m_vBR, v1, v2, true);

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
            else// if (m_dBeginAngle < Math._2PI())
                rResult.m_dBeginAngle = Math._3HALF_PI() - (m_dBeginAngle - Math._3HALF_PI());

            return true;
        }

        /// <summary>
        /// 직선과 타원의 교차점을 구한다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="rLine"></param>
        /// <param name="CBR"></param>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>
        /// rLine과 만나지 않으면 0을 리턴한다.
        /// 교차점이 하나만 존재할 경우 rVertex1에만 값이 담겨지며 1이 리턴된다.
        /// 교차점이 두 개 존재할 경우 rVertex1과 rVertex2에 각각 값이 담겨지며, 2가 리턴된다.
        /// </returns>
        public int IntersectLine(Line2D rLine, out Vertex2D rVertex1, out Vertex2D rVertex2)
        {
            rVertex1 = new Vertex2D();
            rVertex2 = new Vertex2D();

            Vertex2D vBegin = rLine.GetVertex(true);
            Vertex2D vEnd = rLine.GetVertex(false);

            // rLine의 시작점과 끝점이 같으면 계산하지 않는다.
            if (vBegin.GetDistance(vEnd) <= Math.HALF_TOLERANCE())
                return 0;

            // 타원의 방정식 x²/ A²+ y²/ B²= 1을 적용하여 계산하기 위해서는 타원의 중점을 원점에 오도록 위치이동 시킨후
            // 타원의 장축이 X축에 대하여 기울어진 만큼 직선도 회전시켜야 한다.
            // 따라서, 직선도 그만큼 위치이동 및 회전시킨다. 
            Line2D newLine;
            double theta = CoordTranslate(rLine, out newLine);

            int nResult = _IntersectLine(newLine, rVertex1, rVertex2);

            if (nResult == 2)
            {
                rVertex1 = CoordTranslate(rVertex1, -theta) + m_vCenter;
                rVertex2 = CoordTranslate(rVertex2, -theta) + m_vCenter;
            }
            else if (nResult == 1)
                rVertex1 = CoordTranslate(rVertex1, -theta) + m_vCenter;

            return nResult;
        }

        private int _IntersectLine(Line2D rLine, Vertex2D rVertex1, Vertex2D rVertex2)
        {
	        Vertex2D vBegin = rLine.GetVertex(true);
	        Vertex2D vEnd = rLine.GetVertex(false);

	        // rLine 직선의 방정식 y = ax + b
	        // x = constant 형태의 직선일 경우
	        // 직선의 x값 : c
	        double a, b, c = 0.0;
            bool xIsConst = false;

	        if (System.Math.Abs(vBegin.x - vEnd.x) < Math.HALF_TOLERANCE())
	        {
		        a = b = 0.0;
		        c = vBegin.x;
                xIsConst = true;
	        }
	        else if (System.Math.Abs(vBegin.y - vEnd.y) < Math.HALF_TOLERANCE())
	        {
		        a = 0.0;
		        b = vBegin.y;
        }
	        else
	        {
		        a = (vEnd.y - vBegin.y) / (vEnd.x - vBegin.x);
		        b = vEnd.y - a* vEnd.x;
	        }

	        int nResultCount = 0;

	        if (xIsConst)
                nResultCount = _IntersectLine(rLine, rVertex1, rVertex2, c);
	        else
		        nResultCount = _IntersectLine(rLine, rVertex1, rVertex2, a, b);

	        if (nResultCount == 0)
		        return 0;

	        Vertex2D vR = new Vertex2D(100, 0);
            Vertex2D vO = new Vertex2D(0, 0);

	        if (nResultCount == 1)
	        {
		        if (rLine.IsInclude(rVertex1) == false)
			        nResultCount = 0;
		        else
		        {
			        double dAngle = Math.GetAngle(rVertex1, vO, vR);
			        if (rVertex1.x < 0.0)
				        dAngle = Math._2PI() - dAngle;

			        if (!IsInclude(dAngle))
				        nResultCount = 0;
		        }
	        }
	        else// if (nResultCount == 2)
	        {
		        if (rLine.IsInclude(rVertex1) == false)
		        {
			        nResultCount--;
			        rVertex1 = rVertex2;
		        }
		        else
		        {
			        double dAngle = Math.GetAngle(rVertex1, vO, vR);
			        if (rVertex1.x < 0.0)
				        dAngle = Math._2PI() - dAngle;

			        if (!IsInclude(dAngle))
			        {
				        nResultCount--;
				        rVertex1 = rVertex2;
			        }
		        }

		        if (rLine.IsInclude(rVertex2) == false)
			        nResultCount--;
		        else
		        {
			        double dAngle = Math.GetAngle(rVertex2, vO, vR);
			        if (rVertex2.x < 0.0)
				        dAngle = Math._2PI() - dAngle;

			        if (!IsInclude(dAngle))
				        nResultCount--;
		        }
	        }

	        return nResultCount;
        }

        // dAngle : Radian
        private bool IsInclude(double dAngle)
        {
	        if (m_isClosed)
		        return true;

	        double dBeginAngle = m_dBeginAngle;

	        while (dBeginAngle< 0.0)

                dBeginAngle += Math._2PI();

	        while (dBeginAngle > Math._2PI())
		        dBeginAngle -= Math._2PI();

	        if (m_isClockWise)
	        {
		        if (m_dAngle <= dBeginAngle)
		        {
			        if (dAngle >= m_dAngle && dAngle <= dBeginAngle)
				        return true;
		        }
		        else
		        {
			        if (dAngle <= dBeginAngle)
				        return true;
			        else if (Math._2PI() - (m_dAngle - dBeginAngle) <= dAngle)
				        return true;
		        }
	        }
	        else
	        {
		        if (m_dAngle + dBeginAngle <= Math._2PI())
		        {
			        if (dAngle >= dBeginAngle && dAngle <= m_dAngle + dBeginAngle)
				        return true;
		        }
		        else
		        {
			        if (dAngle >= dBeginAngle)
				        return true;
			        else if (m_dAngle + dBeginAngle - Math._2PI() >= dAngle)
				        return true;
		        }
	        }

	        return false;
        }

        // y = ax + b 인 직선과 타원의 교점
        private int _IntersectLine(Line2D rLine, Vertex2D rVertex1, Vertex2D rVertex2, double a, double b)
        {
	        double A = a * a * m_dA * m_dA + m_dB * m_dB;
            double B = 2 * a * b * m_dA * m_dA;
            double C = b * b * m_dA * m_dA - m_dA * m_dA * m_dB * m_dB;
            double D = B * B - 4 * A * C;

	        if (System.Math.Abs(D) < Math.HALF_TOLERANCE())
	        {
		        double x = -B / 2 / A;
                double y = a * x + b;
                rVertex1.SetVertex(x, y);
		        return 1;
	        }
	        else if (D< 0)
		        return 0;

	        double x1 = (-B + System.Math.Sqrt(D)) / 2 / A;
            double y1 = a * x1 + b;
            double x2 = (-B - System.Math.Sqrt(D)) / 2 / A;
            double y2 = a * x2 + b;

            rVertex1.SetVertex(x1, y1);
            rVertex2.SetVertex(x2, y2);
	        return 2;
        }

        // x = c 인 직선과 타원의 교점
        private int _IntersectLine(Line2D rLine, Vertex2D rVertex1, Vertex2D rVertex2, double c)
        {
	        double D = m_dB * m_dB - m_dB * m_dB * c * c / m_dA / m_dA;

	        if (System.Math.Abs(D) < Math.HALF_TOLERANCE())
	        {
		        rVertex1.SetVertex(c, 0.0);
		        return 1;
	        }
	        else if (D< 0.0)
		        return 0;

	        rVertex1.SetVertex(c, System.Math.Sqrt(D));
	        rVertex2.SetVertex(c, -System.Math.Sqrt(D));
	        return 2;
        }

        // rEArc와 만나지 않으면 0을 리턴한다.
        // Return 값 : 두 EArc가 만나서 생기는 (Vertex의 개수) + (EArc 개수 * 100)
        //             만일, 두 EArc가 만나서 하나의 Vertex와 하나의 EArc가 생성된다면 101이 리턴된다.
        //#ifdef DOTNET
        //			virtual int IntersectEArc(EArc2D^ rEArc, OUT System::Collections::ArrayList^% rArrVertex, OUT System::Collections::ArrayList^% rArrEArc);
        //#else
        //        virtual int IntersectEArc(const EArc2D& rEArc, std::vector<Vertex2D>& rArrVertex, std::vector<EArc2D*>& rArrEArc) const;
        //#endif
        //        // EArc위의 한점 vertex로부터 EArc의 진행방향으로 len만큼 떨어진 곳의 좌표를 구한다.
        //        // vertex가 EArc의 각도 범위에 포함되지 않아도 상관없다.
        //        virtual bool GetLinearVertex(REF_CONST(Vertex2D) vertex, double len, OUT CBR(INSTANCE(Vertex2D)) rResult);
        //			// dAngle : Radian
        //			// EArc의 dAngle 위치에 있는 좌표로부터 EArc의 진행방향으로 len만큼 떨어진 곳의 좌표를 구한다.
        //			// dAngle이 EArc의 각도 범위에 포함되지 않아도 상관없다.
        //			virtual bool GetLinearVertex(double dAngle, double len, OUT CBR(INSTANCE(Vertex2D)) rResult);

        // Return 값 : 타원의 회전각(Radian)
        private double CoordTranslate(Line2D line, out Line2D result)
        {
            Vertex2D vR = m_vCenter * 2 - (m_vTL + m_vBL) / 2;
            Vertex2D vX = new Vertex2D(m_vCenter.x + 100, m_vCenter.y);

            double theta = Math.GetAngle(vR, m_vCenter, vX);

            if (vR.y < m_vCenter.y)
                theta = Math._2PI() - theta;

            // m_vCenter만큼 좌표 이동
            Vertex2D vBegin = line.GetVertex(true) - m_vCenter;
            Vertex2D vEnd = line.GetVertex(false) - m_vCenter;

            // theta만큼 회전 이동
            vBegin = CoordTranslate(vBegin, theta);
            vEnd = CoordTranslate(vEnd, theta);

            result = new Line2D(vBegin, vEnd, line.GetLineType());
            return theta;
        }

        private Vertex2D CoordTranslate(Vertex2D rVertex, double theta)
        {
	        double radius = System.Math.Sqrt(rVertex.x * rVertex.x + rVertex.y * rVertex.y);

	        if (radius < Math.HALF_TOLERANCE())
		        return new Vertex2D(rVertex.x, rVertex.y);

            double cosData = (radius * radius + rVertex.x * rVertex.x - rVertex.y * rVertex.y) / 2 / radius / rVertex.x;
            double alpha = System.Math.Acos(cosData);

	        if (rVertex.y < 0.0)
		        alpha = Math._2PI() - alpha;

	        double x = radius * System.Math.Cos(alpha - theta);
            double y = radius * System.Math.Sin(alpha - theta);
	        return new Vertex2D(x, y);
        }
    }
}

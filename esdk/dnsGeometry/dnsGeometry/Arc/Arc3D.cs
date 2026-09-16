namespace UnE.Geometry
{
    public class Arc3D : EArc3D
    {
        protected double m_dRadius = 0.0;

        public Arc3D()
        {
        }

		public Arc3D(Vertex3D v1, Vertex3D v2, Vertex3D v3)
        {
            SetArc(v1, v2, v3);
        }

        public Arc3D(Vertex3D vTL, Vertex3D vBL, Vertex3D vBR, double dRadius, double dBeginAngle, double dArcAngle, bool isClockWise)
        {
            SetArc(vTL, vBL, vBR, dRadius, dBeginAngle, dArcAngle, isClockWise);
        }

		public bool SetArc(Vertex3D v1, Vertex3D v2, Vertex3D v3)
        {
            if (!GetCircleInfo(v1, v2, v3, ref m_vCenter, ref m_dRadius))
                return false;

            m_dA = m_dB = m_dRadius;
            m_isClockWise = false;
            m_isClosed = false;

            Vertex3D vR = GetRightAngleVertex(v1, v2, v3, m_vCenter, m_dRadius);
            Vertex3D vTR = vR + (v1 - m_vCenter);

            m_vBR = vR * 2 - vTR;
            m_vTL = m_vCenter * 2 - m_vBR;
            m_vBL = m_vTL + m_vBR - vTR;
            
            m_dBeginAngle = Math.HALF_PI();
            m_dAngle = Math.GetAngle(v3, m_vCenter, v1);

            if (v3.GetDistance(m_vBL) < v3.GetDistance(m_vBR))
                m_dAngle = Math._2PI() - m_dAngle;
            
            return true;
        }

        public bool SetArc(Vertex3D vTL, Vertex3D vBL, Vertex3D vBR, double dRadius, double dBeginAngle, double dArcAngle, bool isClockWise)
        {
            m_isClockWise = isClockWise;

            m_vTL.CopyFrom(vTL);
            m_vBL.CopyFrom(vBL);
            m_vBR.CopyFrom(vBR);

            m_vCenter = (m_vTL + m_vBR) / 2;

            m_isClosed = dArcAngle >= Math._2PI() - Math.HALF_TOLERANCE() ? true : false;

            m_dAngle = dArcAngle;
            m_dBeginAngle = dBeginAngle;
            m_dA = m_dB = m_dRadius = dRadius;

            return true;
        }

        public double GetRadius()
        {
            return m_dRadius;
        }

        /// <summary>
        /// Arc를 원의 바깥으로 dLen 만큼 확대(outside가 false이면 축소)시킨다.
        /// </summary>
        /// <param name=""></param>
        public Arc3D Offset(bool outside, double dLen)
        {
            Arc3D arc = new Arc3D();
            EArc3D earc = base.Offset(outside, dLen);
            arc.SetArc(earc.GetTL(), earc.GetBL(), earc.GetBR(), earc.GetA(), earc.GetBeginAngle(), earc.GetAngle(), earc.IsClockWise());
            return arc;
        }

        /// <summary>
        /// v1, v2, v3를 지나는 평면을 기준으로 현재의 Arc와 대칭되는 객체를 만들어 리턴한다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="v1"></param>
        /// <param name=""></param>
        /// <param name="v2"></param>
        /// <param name=""></param>
        /// <param name="v3"></param>
        /// <param name="CBR"></param>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>v1, v2, v3가 평면을 구성하지 못할 경우 false를 리턴한다.</returns>
        public bool Mirror(Vertex3D v1, Vertex3D v2, Vertex3D v3, out Arc3D rResult)
        {
            rResult = null;

            double a, b, c, d;  // ax + by + cz + d = 0
            if (!Math.MakePlane(v1, v2, v3, out a, out b, out c, out d))
                return false;

            Vertex3D vBegin = GetBeginVertex();

            rResult = new Arc3D();
            rResult.m_dRadius = m_dRadius;

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

        /// <summary>
        /// Arc 위에서 특정각도에 해당하는 좌표를 얻어온다..
        /// </summary>
        /// <param name="dAngle">Radian</param>
        /// <param name="rVertex"></param>
        /// <returns>dAngle이 범위를 벗어나면 false를 리턴한다.</returns>
		public bool GetVertex(double dAngle, out Vertex3D rVertex)
        {
            rVertex = new Vertex3D();

            if (!CheckValidAngle(dAngle))
                return false;

            Vertex3D vR = m_vCenter + (m_vBR - m_vBL) / 2;
            rVertex = Math.GetLinearVertex(m_vCenter, vR, m_dRadius * System.Math.Cos(dAngle));
            rVertex = rVertex + (m_vBL - m_vTL) * (m_dRadius * System.Math.Sin(dAngle) / m_vBL.GetDistance(m_vTL));

            return true;
        }

		public override EArcType GetType()
        {
            return EArcType.ARC;
        }

        public Vertex3D GetBeginVertex()
        {
            Vertex3D vR = m_vCenter + (m_vBR - m_vBL) / 2;
            Vertex3D vBegin = Math.GetLinearVertex(m_vCenter, vR, m_dRadius * System.Math.Cos(m_dBeginAngle));
            vBegin = vBegin + (m_vTL - m_vBL) * (m_dRadius * System.Math.Sin(m_dBeginAngle) / m_vBL.GetDistance(m_vTL));
            return vBegin;
        }

		public Vertex3D GetEndVertex()
        {
            Vertex3D vR = m_vCenter + (m_vBR - m_vBL) / 2;
            double dAngle = m_isClockWise ? m_dBeginAngle - m_dAngle : m_dBeginAngle + m_dAngle;

            Vertex3D vEnd = Math.GetLinearVertex(m_vCenter, vR, m_dRadius * System.Math.Cos(dAngle));
            vEnd = vEnd + (m_vTL - m_vBL) * (m_dRadius * System.Math.Sin(dAngle) / m_vBL.GetDistance(m_vTL));
            return vEnd;
        }

        // 세 점을 이용하여 원의 중점 및 반지름을 구한다.
        // Return 값 : true이면 값을 구하였다.
        //             false이면 원을 구성하기에 충분치 않은 데이터이다.
        private bool GetCircleInfo(Vertex3D v1, Vertex3D v2, Vertex3D v3, ref Vertex3D rCenter, ref double rRadius)
        {
	        // v1과 v2 사이의 거리
	        double dL1 = v1.GetDistance(v2);

	        if (dL1 < Math.HALF_TOLERANCE() || v2.GetDistance(v3) < Math.HALF_TOLERANCE() || v1.GetDistance(v3) < Math.HALF_TOLERANCE())
		        return false;

	        // v1과 v2의 가운데 위치하는 점
	        Vertex3D vM = (v1 + v2) / 2;

	        // v1과 v2가 이루는 직선과, v1과 v3가 이루는 직선이
	        // 만나서 이루는 각
	        double dTheta1 = Math.GetAngle(v2, v1, v3);
            // v1과 v3가 이루는 직선과, v3와 v2가 이루는 직선이
            // 만나서 이루는 각
            double dTheta2 = Math.GetAngle(v1, v3, v2);

	        // 세 점이 한 직선상에 있다.
	        if (IsEqualRad(dTheta1,0.0))
                return false;
	        if (IsEqualRad(dTheta1, Math.PI()))
                return false;
	        if (IsEqualRad(dTheta2,0.0))
                return false;
	        if (IsEqualRad(dTheta2, Math.PI()))
                return false;

	        // vC : 원의 중점
	        // vQ2 : vM에서 vC 방향으로 직선을 연장하여 원과 만나는 점
	        // vQ1 : vQ2에서 그은 원의 접선과 v1, v3를 잇는 직선이 만나는 점
	        // vQ3 : vM, vQ2를 잇는 직선과 v1, v3를 잇는 직선이 만나는 점
	        Vertex3D vQ2;
	        Vertex3D vQ1;

	        double dLength1 = v1.GetDistance(v3);
            double dLength2 = v2.GetDistance(v3);

	        if (dLength1 == dLength2)	// v3가 vQ2인 경우
	        {
		        rRadius = dLength1* System.Math.Sin(dTheta2 / 2) / System.Math.Sin(Math.PI() - dTheta2);
                rCenter = Math.GetLinearVertex(v3, vM, rRadius);
	        }
	        else if (dTheta1 == Math.HALF_PI())
	        {
		        rRadius = v2.GetDistance(v3) / 2;
		        rCenter = Math.GetLinearVertex(v2, v3, rRadius);
	        }
	        else if (dTheta2 == Math.HALF_PI())
	        {
		        rRadius = v1.GetDistance(v2) / 2;
		        rCenter = Math.GetLinearVertex(v1, v2, rRadius);
	        }
	        else if (dTheta1 < Math.HALF_PI() && dTheta2 > Math.HALF_PI())
	        {
		        return GetCircleInfo(v2, v3, v1, ref rCenter, ref rRadius);
	        }
	        else if (dTheta1 > Math.HALF_PI() && dTheta2 < Math.HALF_PI())
	        {
		        return GetCircleInfo(v2, v1, v3, ref rCenter, ref rRadius);
	        }
	        else
	        {
		        double dL2 = dL1 / 2 * System.Math.Tan(dTheta1);    // vM과 vQ3 사이의 거리
                double dL3 = dL1 / 2 / System.Math.Tan(dTheta2 / 2);// vM과 vQ2 사이의 거리
                double dL4 = dL3 - dL2;                 // vQ2와 vQ3 사이의 거리

                // vQ1, vQ2, vQ3로 이루어진 삼각형과
                // v1, vM, vQ3로 이루어진 삼각형은 닮은꼴이다.
                // 따라서, v1, vM 사이의 거리와 vQ1, vQ2 사이의 거리의 비는
                // vM, vQ3 사이의 거리와 vQ2, vQ3 사이의 거리의 비와 같다.
                double dL5 = dL1 / 2 * dL4 / dL2;       // vQ1과 vQ2 사이의 거리
                double dL6 = dL2 / System.Math.Sin(dTheta1);        // v1과 vQ3 사이의 거리
                double dL7 = dL6 * dL4 / dL2;           // vQ1과 vQ3 사이의 거리
                double dL8 = dL6 + dL7;                 // v1과 vQ1 사이의 거리

                vQ1 = Math.GetLinearVertex(v1, v3, dL8);

		        // vQ1, vQ2를 잇는 직선과 v1, v2를 잇는 직선은 평행하다.
		        vQ2 = vQ1 + (v1 - v2) * dL5 / dL1;
		
		        rRadius = dL1 / 2 / System.Math.Sin(dTheta2);
                rCenter = Math.GetLinearVertex(vQ2, vM, rRadius);
	        }

	        return true;
        }

		// 원 위의 세 점 v1, v2, v3가 있고 원의 중점 vCenter가 있다.
		// v1에서 v2와 v3를 차례대로 지나가는 방향으로 90도 회전한 곳의 좌표를 구한다.
		private static Vertex3D GetRightAngleVertex(Vertex3D v1, Vertex3D v2, Vertex3D v3, Vertex3D vCenter, double dRadius)
        {
            double dTheta1 = Math.GetAngle(v1, vCenter, v2);
            double dTheta2 = Math.GetAngle(v2, vCenter, v3);
            double dTheta3 = Math.GetAngle(v3, vCenter, v1);

            Vertex3D v;

            // v2가 v1의 반대편에 있는 경우
            if (System.Math.Abs(dTheta1 - Math.PI()) <= Math.HALF_TOLERANCE())
            {
                if (dTheta3 == Math.HALF_PI())
                    return Math.GetLinearVertex(v3, vCenter, dRadius * 2);
                else
                {
                    v = GetRightAngleVertex(v1, v3, v2, vCenter, dRadius);
                    return Math.GetLinearVertex(v, vCenter, dRadius * 2);
                }
            }

            if (dTheta1 == Math.HALF_PI())
                return v2;
            else if (dTheta1 < Math.HALF_PI())
            {
                double dL1 = dRadius / System.Math.Cos(Math.HALF_PI() - dTheta1);
                double dL2 = dRadius * System.Math.Tan(Math.HALF_PI() - dTheta1);
                Vertex3D vQ = Math.GetLinearVertex(vCenter, v2, dL1);

                v = vQ + (vCenter - v1) * dL2 / dRadius;
            }
            else
            {
                double dL1 = dRadius / System.Math.Cos(dTheta1 - Math.HALF_PI());
                double dL2 = dRadius * System.Math.Tan(dTheta1 - Math.HALF_PI());
                Vertex3D vQ = Math.GetLinearVertex(vCenter, v2, dL1);

                v = vQ + (v1 - vCenter) * dL2 / dRadius;
            }

            // v1, C, v2가 이루는 각 중 π보다 작은 쪽에 v3가 존재하는 경우
            if (System.Math.Abs(dTheta1 - dTheta2 - dTheta3) <= Math.HALF_TOLERANCE())
            {
                return Math.GetLinearVertex(v, vCenter, dRadius * 2);
            }

            return v;
        }
    }
}

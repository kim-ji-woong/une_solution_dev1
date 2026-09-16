namespace UnE.Geometry
{
    public class Arc2D : EArc2D
    {
        protected double m_dRadius = 0.0;

        public Arc2D()
        {
        }

		public Arc2D(Vertex2D v1, Vertex2D v2, Vertex2D v3)
        {
            SetArc(v1, v2, v3);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="vCenter"></param>
        /// <param name="dRadius"></param>
        /// <param name="dBeginAngle">Radian</param>
        /// <param name="dArcAngle">Radian</param>
        /// <param name="isClockWise"></param>
        public Arc2D(Vertex2D vCenter, double dRadius, double dBeginAngle, double dArcAngle, bool isClockWise)
        {
            SetArc(vCenter, dRadius, dBeginAngle, dArcAngle, isClockWise);
        }

		public bool SetArc(Vertex2D v1, Vertex2D v2, Vertex2D v3)
        {
            if (!GetCircleInfo(v1, v2, v3, ref m_vCenter, ref m_dRadius))
                return false;

            m_dA = m_dB = m_dRadius;
            m_isClosed = false;
            m_isClockWise = Math.IsRightSideFromLine(v2, v1, v3) == 0 ? false : true;

            Vertex2D vOpp = m_vCenter * 2 - v1;

            if (Math.IsRightSideFromLine(v3, v1, vOpp) != 0)
            {
                if (m_isClockWise)
                {
                    // Arc가 이루는 각도가 PI보다 같거나 작다
                    m_dAngle = Math.GetAngle(v1, m_vCenter, v3);
                }
                else
                {
                    // Arc가 이루는 각도가 PI보다 크다
                    m_dAngle = Math._2PI() - Math.GetAngle(v1, m_vCenter, v3);
                }
            }
            else
            {
                if (m_isClockWise)
                {
                    // Arc가 이루는 각도가 PI보다 크다
                    m_dAngle = Math._2PI() - Math.GetAngle(v1, m_vCenter, v3);
                }
                else
                {
                    // Arc가 이루는 각도가 PI보다 같거나 작다
                    m_dAngle = Math.GetAngle(v1, m_vCenter, v3);
                }
            }

            Vertex2D vR = new Vertex2D(m_vCenter.x + m_dRadius, m_vCenter.y);
            if (v1.y >= vR.y)
                m_dBeginAngle = Math.GetAngle(v1, m_vCenter, vR);
            else
                m_dBeginAngle = Math._2PI() - Math.GetAngle(v1, m_vCenter, vR);

            m_vTL.x = m_vCenter.x - m_dRadius;
            m_vTL.y = m_vCenter.y + m_dRadius;
            m_vBL.x = m_vCenter.x - m_dRadius;
            m_vBL.y = m_vCenter.y - m_dRadius;
            m_vBR.x = m_vCenter.x + m_dRadius;
            m_vBR.y = m_vCenter.y - m_dRadius;

            return true;
        }

        // 세 점을 이용하여 원의 중점 및 반지름을 구한다.
        // Return 값 : true이면 값을 구하였다.
        //             false이면 원을 구성하기에 충분치 않은 데이터이다.
        public bool GetCircleInfo(Vertex2D v1, Vertex2D v2, Vertex2D v3, ref Vertex2D rCenter, ref double rRadius)
        {
	        // v1과 v2 사이의 거리
	        double dL1 = v1.GetDistance(v2);

	        if (dL1 < Math.HALF_TOLERANCE() || v2.GetDistance(v3) < Math.HALF_TOLERANCE() || v1.GetDistance(v3) < Math.HALF_TOLERANCE())
		        return false;

	        // v1과 v2의 가운데 위치하는 점
	        Vertex2D vM = Math.GetLinearVertex(v1, v2, dL1/2);

	        // v1과 v2가 이루는 직선과, v1과 v3가 이루는 직선이
	        // 만나서 이루는 각
	        double dTheta1 = Math.GetAngle(v2, v1, v3);
            // v1과 v3가 이루는 직선과, v3와 v2가 이루는 직선이
            // 만나서 이루는 각
            double dTheta2 = Math.GetAngle(v1, v3, v2);

	        // 세 점이 한 직선상에 있다.
	        if (IsEqualRad(dTheta1, 0.0))
                return false;
	        if (IsEqualRad(dTheta1, Math.PI()))
                return false;
	        if (IsEqualRad(dTheta2, 0.0))
                return false;
	        if (IsEqualRad(dTheta2, Math.PI()))
                return false;

	        // vC : 원의 중점
	        // vQ2 : vM에서 vC 방향으로 직선을 연장하여 원과 만나는 점
	        // vQ1 : vQ2에서 그은 원의 접선과 v1, v3를 잇는 직선이 만나는 점
	        // vQ3 : vM, vQ2를 잇는 직선과 v1, v3를 잇는 직선이 만나는 점
	        Vertex2D vQ2;
	        Vertex2D vQ1;

	        double dLength1 = v1.GetDistance(v3);
            double dLength2 = v2.GetDistance(v3);

	        if (dLength1 == dLength2)	// v3가 vQ2인 경우
	        {
		        rRadius = dLength1 * System.Math.Sin(dTheta2 / 2) / System.Math.Sin(Math.PI() - dTheta2);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="vCenter"></param>
        /// <param name="dRadius"></param>
        /// <param name="dBeginAngle">Radian</param>
        /// <param name="dArcAngle">Radian</param>
        /// <param name="isClockWise"></param>
        public void SetArc(Vertex2D vCenter, double dRadius, double dBeginAngle, double dArcAngle, bool isClockWise)
        {
            m_vCenter.CopyFrom(vCenter);
            m_dA = m_dB = m_dRadius = dRadius;
            m_dBeginAngle = dBeginAngle;
            m_dAngle = dArcAngle;
            m_isClockWise = isClockWise;
            m_isClosed = dArcAngle >= Math._2PI() - Math.HALF_TOLERANCE() ? true : false;

            m_vTL.x = m_vCenter.x - dRadius;
            m_vTL.y = m_vCenter.y + dRadius;
            m_vBL.x = m_vCenter.x - dRadius;
            m_vBL.y = m_vCenter.y - dRadius;
            m_vBR.x = m_vCenter.x + dRadius;
            m_vBR.y = m_vCenter.y - dRadius;
        }

        public double GetRadius()
        {
            return m_dRadius;
        }

        /// <summary>
        /// Arc를 원의 바깥으로 dLen 만큼 확대(outside가 false이면 축소)시킨다.
        /// </summary>
        /// <param name="outside"></param>
        /// <param name="dLen"></param>
        /// <returns></returns>
        public Arc2D Offset(bool outside, double dLen)
        {
            Arc2D arc = new Arc2D();
            EArc2D earc = base.Offset(outside, dLen);
            arc.SetArc(earc.GetCenter(), earc.GetA(), earc.GetBeginAngle(), earc.GetAngle(), earc.IsClockWise());
            return arc;
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 Arc 객체와 대칭되는 객체를 만들어 리턴한다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="rResult"></param>
        /// <returns>v1과 v2가 동일한 좌표일 경우 false를 리턴한다.</returns>
        public bool Mirror(Vertex2D v1, Vertex2D v2, out Arc2D rResult)
        {
            rResult = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            Vertex2D vBegin = GetBeginVertex();

            rResult = new Arc2D();
            rResult.m_dRadius = m_dRadius;

            EArc2D earc;

            if (!base.Mirror(v1, v2, out earc))
                return false;

            Vertex2D _vBegin;
            if (!vBegin.Mirror(v1, v2, out _vBegin))
                return false;

            Vertex2D vCenter = earc.GetCenter();
            Vertex2D vR = new Vertex2D(vCenter.x + m_dRadius, vCenter.y);

            double dBeginAngle = Math.GetAngle(vR, vCenter, _vBegin);
            if (_vBegin.y < vCenter.y)
                dBeginAngle = Math._2PI() - dBeginAngle;

            rResult.m_dBeginAngle = dBeginAngle;

            rResult.m_vTL.x = vCenter.x - m_dRadius;
            rResult.m_vTL.y = vCenter.y + m_dRadius;
            rResult.m_vBL.x = vCenter.x - m_dRadius;
            rResult.m_vBL.y = vCenter.y - m_dRadius;
            rResult.m_vBR.x = vCenter.x + m_dRadius;
            rResult.m_vBR.y = vCenter.y - m_dRadius;
            rResult.m_vCenter = vCenter;
            rResult.m_dRadius = rResult.m_vTL.GetDistance(rResult.m_vBL) / 2;
            rResult.m_dAngle = earc.GetAngle();

            return true;
        }

        /// <summary>
        /// Arc 위에서 특정각도에 해당하는 좌표를 얻어온다..
        /// </summary>
        /// <param name="dAngle">Radian</param>
        /// <param name="rVertex"></param>
        /// <returns>dAngle이 범위를 벗어나면 false를 리턴한다.</returns>
        public bool GetVertex(double dAngle, out Vertex2D rVertex)
        {
            rVertex = new Vertex2D();

            if (!CheckValidAngle(dAngle))
                return false;

            rVertex.x = m_vCenter.x + m_dRadius * System.Math.Cos(dAngle);
            rVertex.y = m_vCenter.y + m_dRadius * System.Math.Sin(dAngle);
            return true;
        }

        public override EArcType GetType()
        {
            return EArcType.ARC;
        }

        public Vertex2D GetBeginVertex()
        {
            Vertex2D vertex = new Vertex2D();

            vertex.x = m_vCenter.x + m_dRadius * System.Math.Cos(m_dBeginAngle);
            vertex.y = m_vCenter.y + m_dRadius * System.Math.Sin(m_dBeginAngle);
            return vertex;
        }

		public Vertex2D GetEndVertex()
        {
            Vertex2D vertex = new Vertex2D();
            double dAngle = m_isClockWise ? m_dBeginAngle - m_dAngle : m_dBeginAngle + m_dAngle;

            vertex.x = m_vCenter.x + m_dRadius * System.Math.Cos(dAngle);
            vertex.y = m_vCenter.y + m_dRadius * System.Math.Sin(dAngle);
            return vertex;
        }
    }
}

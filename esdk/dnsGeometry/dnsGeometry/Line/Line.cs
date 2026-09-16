namespace UnE.Geometry
{
    public class Line
    {
        /// <summary>
        /// LINE : 양끝이 무한하게 긴 직선
        /// HALF_LINE_BEGIN_2_END : 시작점에서 끝점 방향으로 끝없이 이어진 반직선
        /// HALF_LINE_END_2_BEGIN : 끝점에서 시작점 방향으로 끝없이 이어진 반직선
        /// SEGMENT : 양끝점이 존재하는 선분
        /// </summary>
        public enum LineType { LINE = 0, HALF_LINE_BEGIN_2_END, HALF_LINE_END_2_BEGIN, SEGMENT, NO_LINE };

        protected LineType m_lineType = LineType.SEGMENT;
    }
}

using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class CommentData : Base.Model.Sop.Component.Component
    {
        private Comment m_annotation = null;

        public Comment Comment
        {
            get { return m_annotation; }
            set { m_annotation = value; }
        }
    }
}

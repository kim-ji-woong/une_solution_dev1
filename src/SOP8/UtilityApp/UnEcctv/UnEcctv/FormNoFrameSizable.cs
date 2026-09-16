using System;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;
using System.Windows.Forms;

namespace UnEcctv
{
    public class FormNoFrameSizable : Form
    {
        private bool m_bLeftMouseDown = false;
        private Point m_ptMove = new Point();

        #region Resize
        private Size m_sizeOrigin = new Size();
        private Point m_ptOrigin = new Point();
        private Panel m_resizePanel = null;
        private bool m_isClicked = false;

        private int m_nEdgeThick = 5;
        #endregion

        protected Panel m_panelLeft = null;
        protected Panel m_panelRight = null;
        protected Panel m_panelBottom = null;
        protected Panel m_panelLB = null;
        protected Panel m_panelRB = null;
        protected Color m_panelColor = Color.FromArgb(14, 22, 45);

        private bool m_sizable = true;
        public bool Sizable
        {
            get { return m_sizable; }
            set { m_sizable = value; }
        }

        // 작아질 수 있는 최소 크기
        private Size m_sizeMinimum = new Size(84, 60);
        public Size MinFrameSize
        {
            get { return m_sizeMinimum; }
            set { m_sizeMinimum = value; }
        }

        public FormNoFrameSizable()
        {
            this.Resize += new System.EventHandler(this.OnFormResize);
            this.Load += new System.EventHandler(this.OnFormLoad);
        }

        protected virtual void OnFormLoad(object sender, EventArgs e)
        {
            AddPanelLeft();
            AddPanelRight();
            AddPanelBottom();
            AddPanelLB();
            AddPanelRB();
        }

        protected virtual void OnFormResize(object sender, EventArgs e)
        {
            ResizeFrame();
        }

        private void ResizeFrame()
        {
            Size panelTopSize = GetPanelTopSize();

            if (panelTopSize.Width <= 0 || panelTopSize.Height <= 0)
                return;

            if (this.m_panelLeft == null)
                return;

            this.m_panelLeft.Location = new Point(0, panelTopSize.Height);
            this.m_panelLeft.Size = new Size(m_nEdgeThick, this.Size.Height - panelTopSize.Height - m_nEdgeThick);
            this.m_panelRight.Location = new Point(this.Size.Width - m_nEdgeThick, panelTopSize.Height);
            this.m_panelRight.Size = new Size(m_nEdgeThick, this.Size.Height - panelTopSize.Height - m_nEdgeThick);
            this.m_panelBottom.Location = new Point(m_nEdgeThick, this.Size.Height - m_nEdgeThick);
            this.m_panelBottom.Size = new Size(this.Size.Width - m_nEdgeThick * 2, m_nEdgeThick);
            this.m_panelLB.Location = new Point(0, this.Size.Height - m_nEdgeThick * 2);
            this.m_panelRB.Location = new Point(this.Size.Width - m_nEdgeThick * 2, this.Size.Height - m_nEdgeThick * 2);
        }

        private void SetAreaCursor(Panel mode)
        {
            if (mode == m_panelRight || mode == m_panelLeft)
                this.Cursor = Cursors.SizeWE;
            else if (mode == m_panelBottom)
                this.Cursor = Cursors.SizeNS;
            else if (mode == m_panelLB)
                this.Cursor = Cursors.SizeNESW;
            else if (mode == m_panelRB)
                this.Cursor = Cursors.SizeNWSE;
        }

        protected virtual void EdgePanelMouseDown(object sender, MouseEventArgs e)
        {
            ProcessPanelMouseDown(e, Control.MousePosition);
        }

        protected void ProcessPanelMouseDown(MouseEventArgs e, Point ptMouse)
        {
            if (e.Button == MouseButtons.Left)
            {
                m_bLeftMouseDown = true;
                m_ptMove = ptMouse;
                m_sizeOrigin = this.Size;
                m_ptOrigin = this.Location;
                OnResizeBegin();
            }

            m_isClicked = true;
        }

        protected virtual void OnResizeBegin()
        {
        }

        protected virtual void EdgePanelMouseLeave(object sender, EventArgs e)
        {
            this.Cursor = Cursors.Arrow;

            m_isClicked = false;
        }

        protected virtual void EdgePanelMouseMove(object sender, MouseEventArgs e)
        {
            ProcessPanelMouseMove(sender, e, Control.MousePosition);
        }

        protected void ProcessPanelMouseMove(object sender, MouseEventArgs e, Point ptMouse)
        {
            if (!m_isClicked)
            {
                m_resizePanel = (Panel)sender;

                SetAreaCursor(m_resizePanel);
                return;
            }

            if (!m_bLeftMouseDown)
                return;

            Point ptScreen = ptMouse;

            int dx = ptScreen.X - m_ptMove.X;
            int dy = ptScreen.Y - m_ptMove.Y;

            if (dx == 0 && dy == 0)
                return;

            if (m_resizePanel == m_panelRight)
            {
                ChangeSize(this.m_sizeOrigin.Width + dx, this.m_sizeOrigin.Height);
            }
            else if (m_resizePanel == m_panelBottom)
            {
                ChangeSize(this.m_sizeOrigin.Width, this.m_sizeOrigin.Height + dy);
            }
            else if (m_resizePanel == m_panelLeft)
            {
                this.Location = new Point(this.m_ptOrigin.X + dx, this.m_ptOrigin.Y);
                ChangeSize(this.m_sizeOrigin.Width - dx, this.m_sizeOrigin.Height);
            }
            else if (m_resizePanel == m_panelLB)
            {
                this.Location = new Point(this.m_ptOrigin.X + dx, this.m_ptOrigin.Y);
                ChangeSize(this.m_sizeOrigin.Width - dx, this.m_sizeOrigin.Height + dy);
            }
            else if (m_resizePanel == m_panelRB)
            {
                ChangeSize(this.m_sizeOrigin.Width + dx, this.m_sizeOrigin.Height + dy);
            }
        }

        private void ChangeSize(int width, int height)
        {
            if (width < m_sizeMinimum.Width)
                width = m_sizeMinimum.Width;

            if (height < m_sizeMinimum.Height)
                height = m_sizeMinimum.Height;

            this.Size = new Size(width, height);
        }

        protected virtual void EdgePanelMouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == System.Windows.Forms.MouseButtons.Left)
            {
                m_bLeftMouseDown = false;
                OnResizeEnd();
            }

            m_isClicked = false;
        }

        protected virtual void OnResizeEnd()
        {
        }

        protected virtual Size GetPanelTopSize()
        {
            return new Size(0, 0);
        }

        private void AddPanelLeft()
        {
            Size panelTopSize = GetPanelTopSize();
            m_panelLeft = new Panel();

            this.m_panelLeft.BackColor = m_panelColor;
            this.m_panelLeft.Location = new Point(0, panelTopSize.Height);
            this.m_panelLeft.Name = "panelLeft";
            this.m_panelLeft.Size = new Size(m_nEdgeThick, this.Size.Height - panelTopSize.Height - m_nEdgeThick);
            this.m_panelLeft.TabIndex = 0;
            this.m_panelLeft.MouseDown += new MouseEventHandler(this.EdgePanelMouseDown);
            this.m_panelLeft.MouseLeave += new EventHandler(this.EdgePanelMouseLeave);
            this.m_panelLeft.MouseMove += new MouseEventHandler(this.EdgePanelMouseMove);
            this.m_panelLeft.MouseUp += new MouseEventHandler(this.EdgePanelMouseUp);

            this.Controls.Add(this.m_panelLeft);
        }

        private void AddPanelRight()
        {
            Size panelTopSize = GetPanelTopSize();
            m_panelRight = new Panel();

            this.m_panelRight.BackColor = m_panelColor;
            this.m_panelRight.Location = new Point(this.Size.Width - m_nEdgeThick, panelTopSize.Height);
            this.m_panelRight.Name = "panelRight";
            this.m_panelRight.Size = new Size(m_nEdgeThick, this.Size.Height - panelTopSize.Height - m_nEdgeThick);
            this.m_panelRight.TabIndex = 0;
            this.m_panelRight.MouseDown += new MouseEventHandler(this.EdgePanelMouseDown);
            this.m_panelRight.MouseLeave += new EventHandler(this.EdgePanelMouseLeave);
            this.m_panelRight.MouseMove += new MouseEventHandler(this.EdgePanelMouseMove);
            this.m_panelRight.MouseUp += new MouseEventHandler(this.EdgePanelMouseUp);

            this.Controls.Add(this.m_panelRight);
        }

        private void AddPanelBottom()
        {
            Size panelTopSize = GetPanelTopSize();
            m_panelBottom = new Panel();

            this.m_panelBottom.BackColor = m_panelColor;
            this.m_panelBottom.Location = new Point(m_nEdgeThick, this.Size.Height - m_nEdgeThick);
            this.m_panelBottom.Name = "panelBottom";
            this.m_panelBottom.Size = new Size(this.Size.Width - m_nEdgeThick * 2, m_nEdgeThick);
            this.m_panelBottom.TabIndex = 0;
            this.m_panelBottom.MouseDown += new MouseEventHandler(this.EdgePanelMouseDown);
            this.m_panelBottom.MouseLeave += new EventHandler(this.EdgePanelMouseLeave);
            this.m_panelBottom.MouseMove += new MouseEventHandler(this.EdgePanelMouseMove);
            this.m_panelBottom.MouseUp += new MouseEventHandler(this.EdgePanelMouseUp);

            this.Controls.Add(this.m_panelBottom);
        }

        private void AddPanelLB()
        {
            Size panelTopSize = GetPanelTopSize();
            m_panelLB = new Panel();

            this.m_panelLB.BackColor = m_panelColor;
            this.m_panelLB.Location = new Point(0, this.Size.Height - m_nEdgeThick * 2);
            this.m_panelLB.Name = "panelLB";
            this.m_panelLB.Size = new Size(m_nEdgeThick * 2, m_nEdgeThick * 2);
            this.m_panelLB.TabIndex = 0;
            this.m_panelLB.MouseDown += new MouseEventHandler(this.EdgePanelMouseDown);
            this.m_panelLB.MouseLeave += new EventHandler(this.EdgePanelMouseLeave);
            this.m_panelLB.MouseMove += new MouseEventHandler(this.EdgePanelMouseMove);
            this.m_panelLB.MouseUp += new MouseEventHandler(this.EdgePanelMouseUp);

            this.Controls.Add(this.m_panelLB);
        }

        private void AddPanelRB()
        {
            Size panelTopSize = GetPanelTopSize();
            m_panelRB = new Panel();

            this.m_panelRB.BackColor = m_panelColor;
            this.m_panelRB.Location = new Point(this.Size.Width - m_nEdgeThick * 2, this.Size.Height - m_nEdgeThick * 2);
            this.m_panelRB.Name = "panelRB";
            this.m_panelRB.Size = new Size(m_nEdgeThick * 2, m_nEdgeThick * 2);
            this.m_panelRB.TabIndex = 0;
            this.m_panelRB.MouseDown += new MouseEventHandler(this.EdgePanelMouseDown);
            this.m_panelRB.MouseLeave += new EventHandler(this.EdgePanelMouseLeave);
            this.m_panelRB.MouseMove += new MouseEventHandler(this.EdgePanelMouseMove);
            this.m_panelRB.MouseUp += new MouseEventHandler(this.EdgePanelMouseUp);

            this.Controls.Add(this.m_panelRB);
        }
    }
}

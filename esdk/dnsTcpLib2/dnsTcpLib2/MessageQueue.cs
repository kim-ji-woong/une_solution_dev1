using System;
using System.Collections;

namespace dnsTcpLib2
{
    /// <summary>
    /// Socket에 데이터를 실어 보낼때 지금 Socket의 상태가 메시지 전송이 가능한 상태인지 확인하여야 하는 경우가 있다.
    /// MessageQueue는 데이터를 일단 저장해 두었다가 전송 가능한 상태가 되면 한꺼번에 큐를 비우는 기능을 제공한다.
    /// </summary>
    public class MessageQueue
    {
        private ArrayList m_arrDatas = new ArrayList();
        private bool m_ableToSend = false;

        public bool AbleToSend
        {
            get { return m_ableToSend; }
            set { m_ableToSend = value; }
        }

        public void Add(QueueData data)
        {
            lock (this)
            {
                int nDataCount = m_arrDatas.Count;

                // 같은 Type의 데이터가 이미 존재하면 기존의 데이터를 없애고 새로운 데이터를 추가한다.
                for (int i = 0; i < nDataCount; i++)
                {
                    QueueData _data = (QueueData)m_arrDatas[i];

                    if (_data.IsSameType(data))
                    {
                        m_arrDatas.RemoveAt(i);
                        break;
                    }
                }

                /*if (data.GetType() == typeof(QueueData_AllReceiverState))
                    m_arrDatas.Insert(0, data);
                else*/
                m_arrDatas.Add(data);
            }
        }

        public void Send(IMessageQueueOwner owner, ClientServiceProvider provider)
        {
            lock (this)
            {
                if (!AbleToSend)
                    return;

                int nBytesLength = GetTotalBytesLength();

                if (nBytesLength <= 0)
                    return;

                byte[] bytes = new byte[nBytesLength];

                int nIndex = 0;
                int nDataCount = m_arrDatas.Count;

                //for (int i = nDataCount - 1; i >= 0; i--)
                for (int i = 0; i < nDataCount; i++)
                {
                    QueueData data = (QueueData)m_arrDatas[i];

                    //if (i < nDataCount - 1)
                    {
                        byte[] bytesLength = BitConverter.GetBytes(data.Bytes.Length);
                        System.Buffer.BlockCopy(bytesLength, 0, bytes, nIndex, 4);
                        nIndex += 4;
                    }

                    System.Buffer.BlockCopy(data.Bytes, 0, bytes, nIndex, data.Bytes.Length);
                    nIndex += data.Bytes.Length;
                }

                owner.Send_NoLengthByte(bytes, provider);
                m_arrDatas.Clear();
            }
        }

        private int GetTotalBytesLength()
        {
            int nBytesLength = 0;

            foreach (QueueData data in m_arrDatas)
            {
                if (data.Bytes == null)
                    continue;

                nBytesLength += data.Bytes.Length + 4;
            }

            /*// 첫번째 데이터는 TcpLib2에서 길이 바이트를 추가하므로 따로 4바이트를 붙이지 않는다.
            nBytesLength -= 4;*/
            return nBytesLength;
        }
    }

    public abstract class QueueData
    {
        private byte[] m_bytes = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }

        public abstract bool IsSameType(QueueData data);
    }

    public interface IMessageQueueOwner
    {
        int Send_NoLengthByte(byte[] bytes, ClientServiceProvider provider);
    }
}

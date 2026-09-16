using System;
using System.Net.Sockets;
using System.Diagnostics;

namespace dnsTcpLib2
{
	public delegate void OnDisposeClient();

	public class TcpClientEx : TcpClient
	{
		public event OnDisposeClient OnDisposeClient;
		private bool m_bDisposed = false;
		protected override void Dispose(bool disposing)
		{
			m_bDisposed = true;
			if (OnDisposeClient != null)
			{
				OnDisposeClient();
			}
			base.Dispose(disposing);
		}

		public byte[] m_arrRecived = null;
		public byte[] ArrRecived
		{
			get { return m_arrRecived; }
			set { m_arrRecived = value; }
		}

		private uint m_nDataSize = 0;
		public uint DataSize
		{
			get { return m_nDataSize; }
			set { m_nDataSize = value; }
		}

	}


	public abstract class ClientServiceProvider
	{
		private TcpClientEx m_client = null;
		private byte[] m_arrReceived = null;
		private byte[] m_arrBuffer = null;
		private string m_strErrorMessage = "";
		private int m_nBuffSize = 4096;

		protected bool m_bDisposed = false;
		public bool IsClientDisposed
		{
			get { return m_bDisposed; }
			set { m_bDisposed = value; }
		}

		private bool m_isConnected = false;
		public bool IsConnected
		{
			get { return m_isConnected; }
		}

		private bool m_bAddedLength = true;
		public bool LengthAdd
		{
			get { return m_bAddedLength; }
			set { m_bAddedLength = value; }
		}

		private bool m_reservationClose = false;

		private void OnClientDispose()
		{
			IsClientDisposed = true;
		}

		private int m_nConnectTimeout = 5000;
		public int ConnectTimeout
		{
			get { return m_nConnectTimeout; }
			set { m_nConnectTimeout = value; }
		}

		private ConnectionLog m_log = null;
		public ConnectionLog ConnectionLog
		{
			get { return m_log; }
			set { m_log = value; }
		}

		private TcpClientEx CreateClient()
		{
			WriteLineLog("SokcetException - Create Client");
			m_reservationClose = false;
			TcpClientEx client = new TcpClientEx();
			client.OnDisposeClient += new OnDisposeClient(OnClientDispose);
			IsClientDisposed = false;
			return client;
		}

		public ClientServiceProvider()
		{
			m_client = CreateClient();
			m_arrBuffer = new byte[m_nBuffSize];
		}

		public ClientServiceProvider(int nBuffSize)
		{
			m_client = CreateClient();
			if (nBuffSize > 0)
			{
				m_arrBuffer = new byte[nBuffSize];
				m_nBuffSize = nBuffSize;
			}
		}

		public ClientServiceProvider(string strIP, int nPort, int nBuffSize)
		{
			m_client = CreateClient();
			if (nBuffSize > 0)
			{
				m_arrBuffer = new byte[nBuffSize];
				m_nBuffSize = nBuffSize;
			}

			Connect(strIP, nPort);
		}

		public bool Connect(string strIP, int nPort)
		{
			try
			{
				if (IsClientDisposed == true)
				{
					m_client = CreateClient();
				}

				//IAsyncResult ar = m_client.BeginConnect(strIP, nPort, null, null);
				//if (ar.AsyncWaitHandle.WaitOne(m_nConnectTimeout))
				//{
				//	return false;
				//}
				m_client.Connect(strIP, nPort);

				if (!m_client.Connected)
				{
					WriteLineLog("Connect trying - But Failed");
					return false;
				}


				m_client.Client.NoDelay = true;

				NetworkStream stream = m_client.GetStream();

				if (stream != null && stream.CanRead)
				{
					m_client.Client.BeginReceive(m_arrBuffer, 0, m_nBuffSize, 0, new AsyncCallback(OnReceiveData_Handler), m_client);
					//stream.BeginRead(m_arrBuffer, 0, m_nBuffSize, new AsyncCallback(OnReceiveData_Handler), m_client);
				}
			}
			catch (System.ObjectDisposedException ex)
			{
				m_client = CreateClient();
				m_strErrorMessage = ex.Message;
				WriteLineLog(ex.Message);
				return false;
			}
			catch (System.Net.Sockets.SocketException ex)
			{
				m_client.Close();
				WriteLineLog("SokcetException - " + ex.Message);
				m_strErrorMessage = ex.Message;
				return false;
			}
			catch (Exception ex)
			{
				m_strErrorMessage = ex.Message;
				WriteLineLog(ex.Message);
				return false;
			}

			m_isConnected = true;
			return true;
		}

		private void WriteLineLog(string strLog)
		{
			ConnectionLog log = m_log == null ? ConnectionLog.Instance : m_log;

			if (log.IsOpened)
				log.WriteLine(strLog);
		}

		private void CheckReservationClose()
		{
			if (m_reservationClose)
			{
				try
				{
					NetworkStream stream = m_client.GetStream();

					if (stream != null && stream.CanRead)
					{
						m_client.Close();
						m_isConnected = false;

						WriteLineLog("CheckReservationClose()");
					}
				}
				catch (System.Exception)
				{
				}

				m_reservationClose = false;
			}
		}

		// 비동기 호출
		// 이 함수가 리턴된다고 하여도 m_client가 즉시 Close() 된 것을 보장하지는 않는다.
		// socket이 완전히 닫힌것을 확인하려면 IsConnected를 호출하여 값이 false로 바뀌는 것을 감시하면 된다.
		public void Close()
		{
			try
			{
				// 이미 Dispose된 상태 이면 추가 처리 안함
				if (IsClientDisposed == true)
				{
					m_isConnected = false;
					m_reservationClose = true;
					return;
				}

				NetworkStream stream = m_client.GetStream();

				if (stream != null && stream.CanRead)
				{
					if (EnableImmediatelyClose())
					{
						OnDropConnection();

						m_client.Close();
						m_isConnected = false;
					}
					else
					{
						// 수신 Thread종료시에 연결 종료 예약
						m_reservationClose = true;
						//stream.Close();
						WriteLineLog("ClientServiceProvider.Close()");
					}
				}
			}
			catch (Exception e)
			{
				OnDropConnection();
				m_strErrorMessage = e.Message;
				m_isConnected = false;
			}
		}

		private bool EnableImmediatelyClose()
		{
			if (m_runReceiveHandler)
				return false;

			if (!m_isConnected)
				return true;

			m_isConnected = false;

			if (!m_runReceiveHandler)
				return true;

			m_isConnected = true;
			return false;
		}

		public abstract void OnReceiveData();
		public abstract void OnDropConnection();

		private bool m_runReceiveHandler = false;

		// Header에 Length Byte가 없음
		private void OnReceiveData_Handler_HeaderNoLengthByte(IAsyncResult ar)
		{
			if (!IsConnected)
				return;

			m_runReceiveHandler = true;
			try
			{
				TcpClientEx client = ar.AsyncState as TcpClientEx;

				NetworkStream stream = client.GetStream();

				if (stream.CanRead)
				{

					int nReadBytes = stream.EndRead(ar);


					if (nReadBytes <= 0)
					{
						OnDropConnection();
						m_client.Close();

						m_isConnected = false;
						m_runReceiveHandler = false;
						WriteLineLog("OnReceiveData_Handler.Close()");
						return;
					}

					// 새로 읽은 데이터 만큼 수신버퍼 사이즈를 변경		
					if (m_client.ArrRecived == null)
					{
						// 처음 읽은 경우
						m_client.ArrRecived = new byte[nReadBytes];
						Array.Copy(m_arrBuffer, 0, m_client.m_arrRecived, 0, nReadBytes);
					}
					else
					{
						// 계속 데이터를 읽는 경우
						int nExistLen = m_client.ArrRecived.Length;
						Array.Resize(ref m_client.m_arrRecived, nExistLen + nReadBytes);
						Array.Copy(m_arrBuffer, 0, m_client.m_arrRecived, nExistLen, nReadBytes);
					}

					if (nReadBytes < m_nBuffSize)
					{
						// 다 읽은 경우								
						m_arrReceived = m_client.ArrRecived;
						OnReceiveData();
						m_client.ArrRecived = null;
						CheckReservationClose();
						if (m_isConnected == false)
							return;
					}
					// 계속 읽기
					stream.BeginRead(m_arrBuffer, 0, m_nBuffSize, new AsyncCallback(OnReceiveData_Handler), m_client);

				}
			}
			catch (System.ObjectDisposedException ex)
			{
				OnDropConnection();
				CheckReservationClose();
				m_client = CreateClient();
				m_strErrorMessage = ex.Message;
			}
			catch (Exception e)
			{
				OnDropConnection();
				m_strErrorMessage = e.Message;
			}
			m_runReceiveHandler = false;
		}

		private void OnReceiveData_Handler(IAsyncResult ar)
		{
			if (!this.LengthAdd)
			{
				OnReceiveData_Handler_HeaderNoLengthByte(ar);
				return;
			}

			if (!IsConnected)
				return;

			m_runReceiveHandler = true;
			WriteLineLog("OnReceiveData_Handler");
			try
			{
				TcpClientEx client = ar.AsyncState as TcpClientEx;

				if (client != m_client)
					return;

				NetworkStream stream = client.GetStream();

				if (stream.CanRead)
				{
					SocketError nErrorCode = SocketError.Success;
					int nReadBytes = client.Client.EndReceive(ar, out nErrorCode);

					//int nReadBytes = stream.EndRead(ar);
					if (nErrorCode != SocketError.Success)
					{
						client.Client.BeginReceive(m_arrBuffer, 0, m_nBuffSize, 0, new AsyncCallback(OnReceiveData_Handler), m_client);
						return;
					}

					if (nReadBytes <= 0)
					{
						OnDropConnection();
						m_client.Close();
						m_isConnected = false;
						m_runReceiveHandler = false;
						WriteLineLog("OnReceiveData_Handler.Close()");
						return;
					}

					int nTotalRead = 0;
					// 새로 읽은 데이터 만큼 수신버퍼 사이즈를 변경		
					if (m_client.ArrRecived == null)
					{
						// 4 Byte보다 작은 경우에 계속 읽는다
						if (nReadBytes <= 4)
						{
							client.Client.BeginReceive(m_arrBuffer, nReadBytes, m_nBuffSize, 0, new AsyncCallback(OnReceiveData_Handler), m_client);
							return;
						}

						m_client.ArrRecived = new byte[nReadBytes];
						Array.Copy(m_arrBuffer, 0, m_client.m_arrRecived, 0, nReadBytes);

						m_client.DataSize = BitConverter.ToUInt32(m_arrBuffer, 0);
						nTotalRead = nReadBytes;
					}
					else
					{
						// 계속 데이터를 읽는 경우
						int nExistLen = m_client.ArrRecived.Length;
						Array.Resize(ref m_client.m_arrRecived, nExistLen + nReadBytes);
						Array.Copy(m_arrBuffer, 0, m_client.m_arrRecived, nExistLen, nReadBytes);

						nTotalRead = nExistLen + nReadBytes;
					}

					uint nSize = m_client.DataSize;
					uint nTargetSize = nSize + 4;
					if (nTotalRead >= nTargetSize)
					{
						if (nTotalRead == nTargetSize)
						{
							WriteLineLog("OnReceiveData : " + m_client.ArrRecived.Length);
							// 다 읽은 경우			
							m_arrReceived = new byte[nSize];
							Array.Copy(m_client.m_arrRecived, 4, m_arrReceived, 0, nSize);
							OnReceiveData();

							//m_arrReceived = m_client.ArrRecived;
							//OnReceiveData();
							m_client.DataSize = 0;
							m_client.ArrRecived = null;
							CheckReservationClose();
							if (m_isConnected == false)
								return;
						}
						else
						{
							WriteLineLog("OnReceiveData : " + m_client.ArrRecived.Length);
							// 다 읽은 경우								


							uint nReadLength = (uint)m_client.m_arrRecived.Length;
							int nExtraLength = (int)nReadLength;
							bool bReadContinue = false;
							do
							{

								// 길이 값을 읽는다.
								uint uSize = BitConverter.ToUInt32(m_client.ArrRecived, 0);
								WriteLineLog("Doing Loop - uSize : " + uSize + "bExtraLength : " + nExtraLength);
								// 남는데이터 길이를 구한다.
								if (nExtraLength < uSize)
								{
									// 남은 데이터가 length보다 작은 경우, 읽을것이 더 있다.
									bReadContinue = true;
									break;
								}
								else
									nExtraLength = (int)nExtraLength - (int)(uSize + 4);

								if (nExtraLength < 0)
								{
									bReadContinue = false;
									break;
								}

								// 한개의 데이터를 처리한다.
								m_arrReceived = new byte[uSize];
								Array.Copy(m_client.m_arrRecived, 4, m_arrReceived, 0, uSize);
								OnReceiveData();

								// 읽은 부분을 제외하고 남는 데이터를 저장한다. 
								if (nExtraLength > 0)
								{
									byte[] arrTemp = new byte[nExtraLength];
									Array.Copy(m_client.m_arrRecived, uSize + 4, arrTemp, 0, nExtraLength);
									m_client.ArrRecived = arrTemp;
								}

							} while (nExtraLength > 4);
							WriteLineLog("End Loop - nExtraLength : " + nExtraLength);
							// 새로 읽는 조건
							if (nExtraLength == 0 || bReadContinue == false)
							{
								m_client.DataSize = 0;
								m_client.ArrRecived = null;
							}

							CheckReservationClose();
							if (m_isConnected == false)
								return;
						}
					}
					// 계속 읽기
					client.Client.BeginReceive(m_arrBuffer, 0, m_nBuffSize, 0, new AsyncCallback(OnReceiveData_Handler), m_client);
					//stream.BeginRead(m_arrBuffer, 0, m_nBuffSize, new AsyncCallback(OnReceiveData_Handler), m_client);													

				}
				else
				{
					WriteLineLog("Stream Can not read");
				}
			}
			catch (System.ObjectDisposedException ex)
			{
				OnDropConnection();
				CheckReservationClose();
				m_client = CreateClient();
				m_strErrorMessage = ex.Message;
			}
			catch (Exception e)
			{
				OnDropConnection();
				m_strErrorMessage = e.Message;
			}
			m_runReceiveHandler = false;
		}

		public int Send(byte[] buffer, int offset, int size)
		{
			if (m_client != null && m_client.Client != null)
			{
				SocketError nErrCode = SocketError.Success;
				int nSendSize = 0;
				if (m_bAddedLength == true)
				{
					uint nDatas = (uint)size;
					byte[] datas = new byte[nDatas + 4];
					byte[] nCount = BitConverter.GetBytes(nDatas);
					Debug.WriteLine(size);
					datas[0] = nCount[0];
					datas[1] = nCount[1];
					datas[2] = nCount[2];
					datas[3] = nCount[3];
					//Array.Copy(buffer, offset, datas, 4, nDatas - offset);
					Array.Copy(buffer, offset, datas, 4, size);

					nSendSize = m_client.Client.Send(datas, 0, size + 4, SocketFlags.None, out nErrCode);
				}
				else
				{
					nSendSize = m_client.Client.Send(buffer, offset, size, SocketFlags.None, out nErrCode);
				}

				if (nErrCode == SocketError.Success)
					return nSendSize;
			}
			return -1;
		}

		public bool SendAsync(byte[] buffer, int offset, int size)
		{
			//return _SendAsync(buffer, offset, size, m_bAddedLength, true);
			return (Send(buffer, offset, size) > 0);
		}

		private bool _SendAsync(byte[] buffer, int offset, int size, bool addLength, bool addCallback)
		{
			if (m_client == null)
				return false;

			SocketAsyncEventArgs e = new SocketAsyncEventArgs();

			if (addLength == true)
			{
				uint nDatas = (uint)size;
				byte[] datas = new byte[nDatas + 4];
				byte[] nCount = BitConverter.GetBytes(nDatas);
				Debug.WriteLine(size);
				datas[0] = nCount[0];
				datas[1] = nCount[1];
				datas[2] = nCount[2];
				datas[3] = nCount[3];
				Array.Copy(buffer, offset, datas, 4, size);

				e.SetBuffer(datas, 0, datas.Length);
			}
			else
				e.SetBuffer(buffer, offset, size);

			if (addCallback)
				e.Completed += new EventHandler<SocketAsyncEventArgs>(SendCallback);

			bool completedAsync = false;

			try
			{
				completedAsync = m_client.Client.SendAsync(e);
			}
			catch (Exception se)
			{
				WriteLineLog("Socket Exception Message: " + se.Message);
				OnDropConnection();
			}

			if (!completedAsync)
			{
				// The call completed synchronously so invoke the callback ourselves
				//SendCallback(this, e);
			}

			return true;
		}

		private void SendCallback(object sender, SocketAsyncEventArgs e)
		{
			if (e.SocketError == SocketError.Success)
			{
				// You may need to specify some type of state and 
				// pass it into the BeginSend method so you don't start
				// sending from scratch
				//_SendAsync(e.Buffer, e.Offset, e.Count, false, false);
			}
			else
			{
				try
				{
					System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)m_client.Client.RemoteEndPoint;
					string strIP = endPoint.Address.ToString();
					int nPort = endPoint.Port;

					WriteLineLog(string.Format("Socket Error: {0} when sending to {1}:{2}",
						   e.SocketError,
						   strIP,
						   nPort));
				}
				catch (Exception)
				{
				}

				_SendAsync(e.Buffer, e.Offset, e.Count, false, false);
			}
		}

		public TcpClientEx Client
		{
			get { return m_client; }
		}

		public byte[] ReceivedData
		{
			get { return m_arrReceived; }
		}

		public string ErrorMessage
		{
			get { return m_strErrorMessage; }
		}
	}
}

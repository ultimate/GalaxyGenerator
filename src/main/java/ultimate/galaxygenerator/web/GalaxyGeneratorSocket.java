package ultimate.galaxygenerator.web;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ultimate.galaxygenerator.model.GalaxySpecification;
import ultimate.galaxygenerator.web.model.GalaxyGeneratorRequest;

public class GalaxyGeneratorSocket extends WebSocketAdapter
{
	private transient final Logger	logger	= LoggerFactory.getLogger(this.getClass());

	private GalaxySpecification		gs;
	private ObjectMapper			objectMapper;
	private GeneratorThread			thread;
	private AtomicInteger			coordinatesToGenerate;

	public GalaxyGeneratorSocket()
	{
		super();
		this.objectMapper = new ObjectMapper();
		this.thread = new GeneratorThread();
	}

	@Override
	public void onWebSocketConnect(Session sess)
	{
		super.onWebSocketConnect(sess);
		this.thread.start();
	}

	@Override
	public void onWebSocketClose(int statusCode, String reason)
	{
		synchronized(this.coordinatesToGenerate)
		{
			this.coordinatesToGenerate.notifyAll();
		}
		super.onWebSocketClose(statusCode, reason);
	}

	@Override
	public void onWebSocketText(String message)
	{
		if(isConnected())
		{
			super.onWebSocketText(message);

			logger.debug(message);

			try
			{
				try
				{
					GalaxyGeneratorRequest request = null;
					request = objectMapper.readValue(message, GalaxyGeneratorRequest.class);

					if(gs != null)
					{
						if(request.isClear())
							gs.clearElements();

						if(request.getSize() != null)
						{
							if(request.getSize().length == 3)
								gs.setSize(request.getSize()[0], request.getSize()[1], request.getSize()[2]);
							else
								writeMessage("illegal dimension for size", true);
						}

						if(request.getSeed() != null)
							gs.setSeed(request.getSeed());
					}
					else
					{
						// clear can be ignored, since gs is still null

						if(request.getSize() != null && request.getSeed() != null)
							gs = new GalaxySpecification(request.getSize()[0], request.getSize()[1], request.getSize()[2], request.getSeed());
						else if(request.getSize() != null)
							gs = new GalaxySpecification(request.getSize()[0], request.getSize()[1], request.getSize()[2]);
						else if(request.getSeed() != null)
							writeMessage("cannot set seed before size has been set", true);
					}

					if(request.getElements() != null)
					{
					}

					if(request.getGenerateCoordinates() > 0)
					{
						if(gs != null && gs.getElements().size() > 0)
							generateCoordinates(request.getGenerateCoordinates());
						else if(gs == null)
							writeMessage("initialization incomplete: size missing", true);
						else if(gs.getElements().size() == 0)
							writeMessage("initialization incomplete: element missing", true);
					}
				}
				catch(JsonMappingException e)
				{
					logger.error(e.getMessage(), e);
					writeMessage("illegal message", true);
				}
				catch(JsonProcessingException e)
				{
					logger.error(e.getMessage(), e);
					writeMessage("illegal message", true);
				}
			}
			catch(IOException e)
			{
				logger.error(e.getMessage(), e);
			}
		}
	}

	protected void generateCoordinates(int amount) throws IOException
	{
		int remaining = 0;
		synchronized(coordinatesToGenerate)
		{
			remaining = coordinatesToGenerate.addAndGet(amount);
			coordinatesToGenerate.notifyAll();
		}
		String msg = "remaining coordinates to generate = " + remaining;
		writeMessage(msg, false);
		logger.debug(msg);
	}

	protected void writeCoordinate(int[] coordinate) throws IOException
	{
		getRemote().sendPartialString("[", false);
		for(int i = 0; i < coordinate.length; i++)
		{
			if(i > 0)
				getRemote().sendPartialString(",", false);
			getRemote().sendPartialString(Integer.toString(coordinate[i]), false);
		}
		getRemote().sendPartialString("]", true);
	}

	protected void writeMessage(String message, boolean error) throws IOException
	{
		getRemote().sendPartialString("{\"message\":\"", false);
		getRemote().sendPartialString(message, false);
		getRemote().sendPartialString("\"", false);
		if(error)
			getRemote().sendPartialString(", \"error\":\"true\"", false);
		getRemote().sendPartialString("}", true);
	}

	private class GeneratorThread extends Thread
	{
		@Override
		public void run()
		{
			int[] coord;
			while(isConnected())
			{
				while(coordinatesToGenerate.get() == 0)
				{
					synchronized(coordinatesToGenerate)
					{
						try
						{
							coordinatesToGenerate.wait();
						}
						catch(InterruptedException e)
						{
							logger.error(e.getMessage(), e);
						}
					}
				}
				if(!isConnected())
					break;

				synchronized(coordinatesToGenerate)
				{
					coord = gs.nextCoordinate();
					coordinatesToGenerate.addAndGet(-1);
				}

				try
				{
					writeCoordinate(coord);
				}
				catch(IOException e)
				{
					logger.error(e.getMessage(), e);
				}
			}
		}
	}
}

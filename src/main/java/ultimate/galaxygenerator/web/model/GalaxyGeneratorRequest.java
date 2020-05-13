package ultimate.galaxygenerator.web.model;

import java.util.List;

import ultimate.galaxygenerator.model.GalaxyElement;

public class GalaxyGeneratorRequest
{
	private int[]				size;
	private Long				seed;
	private List<GalaxyElement>	elements;
	private int					generateCoordinates;
	private boolean				clear;

	public GalaxyGeneratorRequest()
	{
		super();
	}

	public int[] getSize()
	{
		return size;
	}

	public void setSize(int[] size)
	{
		this.size = size;
	}

	public Long getSeed()
	{
		return seed;
	}

	public void setSeed(Long seed)
	{
		this.seed = seed;
	}

	public List<GalaxyElement> getElements()
	{
		return elements;
	}

	public void setElements(List<GalaxyElement> elements)
	{
		this.elements = elements;
	}

	public int getGenerateCoordinates()
	{
		return generateCoordinates;
	}

	public void setGenerateCoordinates(int generateCoordinates)
	{
		this.generateCoordinates = generateCoordinates;
	}

	public boolean isClear()
	{
		return clear;
	}

	public void setClear(boolean clear)
	{
		this.clear = clear;
	}
}

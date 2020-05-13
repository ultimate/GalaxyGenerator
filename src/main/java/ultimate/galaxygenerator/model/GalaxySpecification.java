package ultimate.galaxygenerator.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;

import ultimate.galaxygenerator.math.GalaxyGenerator;

/**
 * Class representing the specification for a galaxy. The specification will be initialized with
 * fixed dimensions. After that galaxy types which define the distribution of the stars can be
 * added.
 */
public class GalaxySpecification
{
	/**
	 * Default map with no parameters set
	 */
	public static final Map<String, Double> NO_PARAMS = new HashMap<String, Double>();
	/**
	 * The dimension in X direction
	 */
	protected int						xSize;
	/**
	 * The dimension in Y direction
	 */
	protected int						ySize;
	/**
	 * The dimension in Z direction
	 */
	protected int						zSize;

	/**
	 * The storage of the {@link EnumGalaxyElementType} for this {@link GalaxySpecification}
	 */
	private TreeMap<Double, GalaxyElement>	elements;

	/**
	 * The sum of the weights of all {@link EnumGalaxyElementType}s in this {@link GalaxySpecification}
	 */
	private double						totalWeight;

	/**
	 * The random number generator
	 */
	protected Random					random;

	/**
	 * Create a new GalaxySpecification with the given galaxy dimensions and a default
	 * {@link Random}.
	 * 
	 * @param xSize - The dimension in X direction
	 * @param ySize - The dimension in Y direction
	 * @param zSize - The dimension in Z direction
	 */
	public GalaxySpecification(int xSize, int ySize, int zSize)
	{
		this(xSize, ySize, zSize, new Random());
	}

	/**
	 * Create a new GalaxySpecification with the given galaxy dimensions and a {@link Random} using
	 * the given seed.
	 * 
	 * @param xSize - The dimension in X direction
	 * @param ySize - The dimension in Y direction
	 * @param zSize - The dimension in Z direction
	 * @param seed - the seed to use for the random
	 */
	public GalaxySpecification(int xSize, int ySize, int zSize, long seed)
	{
		this(xSize, ySize, zSize, new Random(seed));
	}

	/**
	 * Create a new GalaxySpecification with the given galaxy dimensions and a given {@link Random}
	 * 
	 * @param xSize - The dimension in X direction
	 * @param ySize - The dimension in Y direction
	 * @param zSize - The dimension in Z direction
	 * @param random - the random to use
	 */
	protected GalaxySpecification(int xSize, int ySize, int zSize, Random random)
	{
		super();
		this.setSize(xSize, ySize, zSize);
		this.elements = new TreeMap<Double, GalaxyElement>();
		this.random = random;
		this.totalWeight = 0;
	}

	/**
	 * @return The dimension in X direction
	 */
	public int getXSize()
	{
		return xSize;
	}

	/**
	 * @return The dimension in Y direction
	 */
	public int getYSize()
	{
		return ySize;
	}

	/**
	 * @return The dimension in Z direction
	 */
	public int getZSize()
	{
		return zSize;
	}


	/**
	 * @return The volume as xSize * ySize * zSize
	 */
	public long getVolume()
	{
		return xSize * ySize * zSize;
	}

	/**
	 * @return The random number generator
	 */
	public Random getRandom()
	{
		return random;
	}

	/**
	 * @return The galaxy elements in this specification
	 */
	public Collection<GalaxyElement> getElements()
	{
		return Collections.unmodifiableCollection(this.elements.values());
	}
	
	/**
	 * Update the size for this specification.<br>
	 * Note: priorly generated coordinates should be discarded or otherwise distribution may be inappropriate
	 *   
	 * @param xSize - The dimension in X direction
	 * @param ySize - The dimension in Y direction
	 * @param zSize - The dimension in Z direction
	 */
	public void setSize(int xSize, int ySize, int zSize)
	{
		if(xSize <= 0)
			throw new IllegalArgumentException("xSize must not be 0 or negative");
		if(ySize <= 0)
			throw new IllegalArgumentException("ySize must not be 0 or negative");
		if(zSize <= 0)
			throw new IllegalArgumentException("zSize must not be 0 or negative");
		this.xSize = xSize;
		this.ySize = ySize;
		this.zSize = zSize;
	}
	
	/**
	 * Update the seed for this specification
	 * Note: Seed will apply for newly generated coordinates only
	 * 
	 * @param seed - the seed to use for the random
	 */
	public void setSeed(long seed)
	{
		this.setRandom(new Random(seed));
	}

	/**
	 * Update the random for this specification
	 * Note: random will apply for newly generated coordinates only
	 * 
	 * @param random - the random to use 
	 */
	protected void setRandom(Random random)
	{
		this.random = random;
	}

	/**
	 * Add a new galaxy element to this specification
	 * 
	 * @param element - the element definition of the galaxy to add
	 * @param weight - the weight of the element (relative to the other types added)
	 * @param parameters - the parameters for this element (@see
	 *            {@link EnumGalaxyElementType#getRequiredParameters()} for required parameters
	 */
	public void addElement(EnumGalaxyElementType element, double weight, Map<String, Double> parameters)
	{
		addElement(new GalaxyElement(this, element, weight, parameters));
	}

	/**
	 * Add a new galaxy element to this specification
	 * 
	 * @param element - the element as {@link GalaxySpecification#Element}
	 */
	public void addElement(GalaxyElement element)
	{
		if(element == null)
			throw new IllegalArgumentException("element must not be null!");
		totalWeight += element.getWeight();
		this.elements.put(totalWeight, element);
	}

	/**
	 * Add new galaxy elements to this specification
	 * 
	 * @param elements - the elements as List of {@link GalaxySpecification#Element}
	 */
	public void addElements(List<GalaxyElement> elements)
	{
		if(elements == null)
			throw new IllegalArgumentException("elements must not be null!");
		if(elements.contains(null))
			throw new IllegalArgumentException("elements must not contain null!");

		for(GalaxyElement e : elements)
			this.addElement(e);
	}
	
	/**
	 * Remove all galaxy elements from this specification to start over
	 */
	public void clearElements()
	{
		this.elements.clear();
		this.totalWeight = 0;
	}

	/**
	 * Generate a new coordinate according to the specified elements and their weights
	 * 
	 * @return coordinate [x, y, z]
	 */
	public int[] nextCoordinate()
	{
		if(this.elements.size() == 0)
			throw new IllegalStateException("no elements defined");
		
		GalaxyElement elem = this.elements.higherEntry(random.nextDouble() * this.totalWeight).getValue();

		return GalaxyGenerator.nextCoordinate(this, elem.getType(), elem.getParameters());
	}

	/**
	 * Generate a list of new coordinate according to the specified elements and their weights
	 * 
	 * @return list of coordinates [x, y, z]
	 */
	public List<int[]> nextCoordinats(int amount)
	{
		List<int[]> coordinates = new ArrayList<int[]>(amount);
		for(int i = 0; i < amount; i++)
		{
			coordinates.add(nextCoordinate());
		}
		return coordinates;
	}

	/**
	 * Elliptic galaxy as defined by https://en.wikipedia.org/wiki/Galaxy_morphological_classification
	 * Note: represents E0-E7 depending on the dimensions  
	 */
	public static class Ex extends GalaxySpecification
	{
		// @formatter:off
		public Ex(int xSize, int ySize, int zSize)					{	super(xSize, ySize, zSize);				}
		public Ex(int xSize, int ySize, int zSize, long seed)		{	super(xSize, ySize, zSize, seed);		}
		public Ex(int xSize, int ySize, int zSize, Random random)	{	super(xSize, ySize, zSize, random);		}
		// @formatter:on
		
		// initializer
		{
			this.addElement(EnumGalaxyElementType.E, 1.0, NO_PARAMS);
		}
	}

	/**
	 * Lenticular galaxy as defined by https://en.wikipedia.org/wiki/Galaxy_morphological_classification
	 */
	public static class S0 extends GalaxySpecification
	{
		// @formatter:off
		public S0(int xSize, int ySize, int zSize)					{	super(xSize, ySize, zSize);				}
		public S0(int xSize, int ySize, int zSize, long seed)		{	super(xSize, ySize, zSize, seed);		}
		public S0(int xSize, int ySize, int zSize, Random random)	{	super(xSize, ySize, zSize, random);		}
		// @formatter:on
		
		// initializer
		{
			this.addElement(EnumGalaxyElementType.E, 1.0, NO_PARAMS);
			Map<String, Double> PARAMS_D = new HashMap<String, Double>();
			PARAMS_D.put("thickness", 0.1);
			this.addElement(EnumGalaxyElementType.D, 0.75, PARAMS_D);
		}
	}
}

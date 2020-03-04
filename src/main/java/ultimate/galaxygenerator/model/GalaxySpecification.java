package ultimate.galaxygenerator.model;

import java.util.ArrayList;
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
	 * The storage of the {@link EnumGalaxyElement} for this {@link GalaxySpecification}
	 */
	private TreeMap<Double, Element>	elements;

	/**
	 * The sum of the weights of all {@link EnumGalaxyElement}s in this {@link GalaxySpecification}
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
	public GalaxySpecification(int xSize, int ySize, int zSize, Random random)
	{
		super();
		this.xSize = xSize;
		this.ySize = ySize;
		this.zSize = zSize;
		this.elements = new TreeMap<Double, Element>();
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
	 * @return The random number generator
	 */
	public Random getRandom()
	{
		return random;
	}

	/**
	 * Add a new galaxy element to this specification
	 * 
	 * @param element - the element definition of the galaxy to add
	 * @param weight - the weight of the element (relative to the other types added)
	 * @param parameters - the parameters for this element (@see
	 *            {@link EnumGalaxyElement#getRequiredParameters()} for required parameters
	 */
	public void addElement(EnumGalaxyElement element, double weight, Map<String, Double> parameters)
	{
		addElement(new Element(element, weight, parameters));
	}

	/**
	 * Add a new galaxy element to this specification
	 * 
	 * @param element - the element as {@link GalaxySpecification#Element}
	 */
	public void addElement(Element element)
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
	public void addElements(List<Element> elements)
	{
		if(elements == null)
			throw new IllegalArgumentException("elements must not be null!");
		if(elements.contains(null))
			throw new IllegalArgumentException("elements must not contain null!");

		for(Element e : elements)
			this.addElement(e);
	}

	/**
	 * Generate a new coordinate according to the specified elements and their weights
	 * 
	 * @return coordinate [x, y, z]
	 */
	public int[] nextCoordinate()
	{
		Element elem = this.elements.higherEntry(random.nextDouble() * this.totalWeight).getValue();

		return GalaxyGenerator.nextCoordinate(this, elem.getElement(), elem.getParameters());
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
	 * Internal class for storing the elements.
	 */
	private class Element
	{
		/**
		 * the element definition
		 */
		protected EnumGalaxyElement		element;
		/**
		 * the weight of the element (relative to the other elements of this galaxy)
		 */
		protected double				weight;
		/**
		 * the parameters for this element
		 */
		protected Map<String, Double>	parameters;

		/**
		 * Create a new Element for inner storage
		 * 
		 * @param element - the element definition
		 * @param weight - the weight of the element (relative to the other elements of this galaxy)
		 * @param parameters - the parameters for this element
		 */
		public Element(EnumGalaxyElement element, double weight, Map<String, Double> parameters)
		{
			super();

			if(element == null)
				throw new IllegalArgumentException("element must not be null!");
			if(weight <= 0.0)
				throw new IllegalArgumentException("weight must not be 0 (zero) or negative!");

			// check parameters
			for(String key : element.getRequiredParameters())
			{
				if(!parameters.containsKey(key))
					throw new IllegalArgumentException("required parameter '" + key + "' not found");
			}

			this.element = element;
			this.weight = weight;
			this.parameters = parameters;
		}

		/**
		 * @return the element definition
		 */
		public EnumGalaxyElement getElement()
		{
			return element;
		}

		/**
		 * @return the weight of the element (relative to the other elements of this galaxy)
		 */
		public double getWeight()
		{
			return weight;
		}

		/**
		 * @return the parameters for this element
		 */
		public Map<String, Double> getParameters()
		{
			return parameters;
		}
	}
	
	// @formatter:off
	/**
	 * Elliptic galaxy as defined by https://en.wikipedia.org/wiki/Galaxy_morphological_classification
	 * Note: represents E0-E7 depending on the dimensions  
	 */
	public static class Ex extends GalaxySpecification
	{
		public Ex(int xSize, int ySize, int zSize, long seed)		{	super(xSize, ySize, zSize, seed);		}
		public Ex(int xSize, int ySize, int zSize, Random random)	{	super(xSize, ySize, zSize, random);		}
		public Ex(int xSize, int ySize, int zSize)					{	super(xSize, ySize, zSize);				}
		
		// initializer
		{
			this.addElement(EnumGalaxyElement.E, 1.0, NO_PARAMS);
		}
	}

	/**
	 * Lenticular galaxy as defined by https://en.wikipedia.org/wiki/Galaxy_morphological_classification
	 */
	public static class S0 extends GalaxySpecification
	{
		public S0(int xSize, int ySize, int zSize, long seed)		{	super(xSize, ySize, zSize, seed);		}
		public S0(int xSize, int ySize, int zSize, Random random)	{	super(xSize, ySize, zSize, random);		}
		public S0(int xSize, int ySize, int zSize)					{	super(xSize, ySize, zSize);				}
		
		// initializer
		{
			this.addElement(EnumGalaxyElement.E, 1.0, NO_PARAMS);
			Map<String, Double> PARAMS_D = new HashMap<String, Double>();
			PARAMS_D.put("thickness", 0.1);
			this.addElement(EnumGalaxyElement.D, 0.75, PARAMS_D);
		}
	}
	// @formatter:on
}

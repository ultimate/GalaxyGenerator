package ultimate.galaxygenerator.model;

import java.util.Map;

/**
 * Class representing single elements in {@link GalaxySpecification}
 */
public class GalaxyElement
{
	/**
	 * the type definition
	 */
	protected EnumGalaxyElementType		type;
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
	public GalaxyElement(GalaxySpecification galaxySpecification, EnumGalaxyElementType type, double weight, Map<String, Double> parameters)
	{
		if(type == null)
			throw new IllegalArgumentException("type must not be null!");
		if(weight <= 0.0)
			throw new IllegalArgumentException("weight must not be 0 (zero) or negative!");

		// check parameters
		for(String key : type.getRequiredParameters())
		{
			if(!parameters.containsKey(key))
				throw new IllegalArgumentException("required parameter '" + key + "' not found");
		}

		this.type = type;
		this.weight = weight;
		this.parameters = parameters;
	}

	/**
	 * @return the type definition
	 */
	public EnumGalaxyElementType getType()
	{
		return type;
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
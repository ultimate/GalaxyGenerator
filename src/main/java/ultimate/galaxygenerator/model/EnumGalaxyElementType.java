package ultimate.galaxygenerator.model;

import java.util.ArrayList;
import java.util.List;

public enum EnumGalaxyElementType
{
	/**
	 * ellipse
	 */
	E,
	/**
	 * disc
	 */
	D,
	/**
	 * ring
	 */
	R,
	/**
	 * arc
	 */
	C,
	/**
	 * bar
	 */
	B,
	/**
	 * spiral arm
	 */
	S;

	/**
	 * Get the list of required parameters.
	 * 
	 * @see GalaxySpecification#addElement(EnumGalaxyElementType, double, java.util.Map)
	 * @return the list of parameter names
	 */
	public List<String> getRequiredParameters()
	{
		List<String> requiredParameters = new ArrayList<String>();

		switch(this)
		{
			case B:
				requiredParameters.add("length");
				break;
			case E:
				break;
			case D:
				requiredParameters.add("thickness");
				break;
			case C:
				requiredParameters.add("phiStart");
				requiredParameters.add("phiEnd");
			case R:
				requiredParameters.add("radius");
				requiredParameters.add("tubeRadius");
				break;
			case S:
				requiredParameters.add("tubeRadius");
				requiredParameters.add("numberOfTwists");
				break;
			default:
		}

		return requiredParameters;
	}

	/**
	 * Get the list of optional parameters.
	 * 
	 * @see GalaxySpecification#addElement(EnumGalaxyElementType, double, java.util.Map)
	 * @return the list of parameter names
	 */
	public List<String> getOptionalParameters()
	{
		List<String> optionalParameters = new ArrayList<String>();

		optionalParameters.add("scaleX");
		optionalParameters.add("scaleY");
		optionalParameters.add("scaleZ");
		optionalParameters.add("translateX");
		optionalParameters.add("translateY");
		optionalParameters.add("translateZ");
		optionalParameters.add("rotateX");
		optionalParameters.add("rotateY");
		optionalParameters.add("rotateZ");

		return optionalParameters;
	}
}

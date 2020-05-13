package ultimate.galaxygenerator.math;

import java.util.Map;
import java.util.Random;

import ultimate.galaxygenerator.model.EnumGalaxyElementType;
import ultimate.galaxygenerator.model.GalaxySpecification;

// TODO functions not yet implemented or not yet perfectly tuned
public class GalaxyGenerator
{
	public static int[] nextCoordinate(GalaxySpecification specification, EnumGalaxyElementType element, Map<String, Double> parameters)
	{
		switch(element)
		{
			//@formatter:off
			case B: 	return nextB(specification, parameters);
			case C:		return nextC(specification, parameters);
			case D:		return nextD(specification, parameters);
			case E:		return nextE(specification, parameters);
			case R:		return nextR(specification, parameters);
			case S:		return nextS(specification, parameters);
			default:	return null;
			//@formatter:off
		}
	}

	public static int[] nextB(GalaxySpecification specification, Map<String, Double> parameters)
	{
		return new int[] {0,0,0};
	}

	public static int[] nextC(GalaxySpecification specification, Map<String, Double> parameters)
	{
		return new int[] {0,0,0};
	}

	public static int[] nextD(GalaxySpecification specification, Map<String, Double> parameters)
	{
		Random random = specification.getRandom();
		double thickness = parameters.get("thickness");

		int x, y, z;
		double r;
		double g1, g2, g3;
		double scale, scaleXY;
		
		// option 1
		r = Math.pow(random.nextDouble(), 2.0 /3.0);
		// option 2
		r = nextLimitedGaussian(random);
		
		g1 = random.nextGaussian();
		g2 = random.nextGaussian();
		g3 = random.nextGaussian();
		
		scale = Math.sqrt(g1 * g1 + g2 * g2 + g3 * g3);
		
		scaleXY = Math.sqrt(g1 * g1 + g2 * g2);
		
		x = (int) Math.round(r / scale * g1 * specification.getXSize() / 2);
		y = (int) Math.round(r / scale * g2 * specification.getYSize() / 2);
		z = (int) Math.round(r / scaleXY * g3 * specification.getZSize() * thickness / 2);
		
		return new int[] {x,y,z};
	}

	public static int[] nextE(GalaxySpecification specification, Map<String, Double> parameters)
	{
		Random random = specification.getRandom();

		int x, y, z;
		double r;
		double g1, g2, g3;
		double scale;
		
		// option 1
		r = Math.pow(random.nextDouble(), 1.0 / 3.0);
		// option 2
		r = nextLimitedGaussian(random);
		
		g1 = random.nextGaussian();
		g2 = random.nextGaussian();
		g3 = random.nextGaussian();
		
		scale = Math.sqrt(g1 * g1 + g2 * g2 + g3 * g3);
		
		x = (int) Math.round(r / scale * g1 * specification.getXSize() / 2);
		y = (int) Math.round(r / scale * g2 * specification.getYSize() / 2);
		z = (int) Math.round(r / scale * g3 * specification.getZSize() / 2);
		
		return new int[] {x,y,z};
	}

	public static int[] nextR(GalaxySpecification specification, Map<String, Double> parameters)
	{
		return new int[] {0,0,0};
	}

	public static int[] nextS(GalaxySpecification specification, Map<String, Double> parameters)
	{
		return new int[] {0,0,0};
	}
	
	private static double nextLimitedGaussian(Random random)
	{
		double r;
		do
		{
			r = Math.abs(random.nextGaussian());
		}
		while(r > 1);
		return r;
	}
	
	public static void main(String[] args)
	{
		
	}
}

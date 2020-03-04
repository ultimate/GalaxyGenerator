package ultimate.galaxygenerator.visualization;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JFrame;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ultimate.galaxygenerator.model.GalaxySpecification;

/**
 * Generate a galaxy and display it for test purposes
 * 
 * @author ultimate
 */
public abstract class GalaxyGeneratorDemo
{
	protected static transient final Logger	logger	= LoggerFactory.getLogger(GalaxyGeneratorDemo.class);

	private static final boolean			paint	= true;
	private static final boolean			js		= true;

	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		logger.debug("----------------------");
		logger.debug("Generating Galaxy...");
		logger.debug("----------------------");
		
		int amount = 50000;

		GalaxySpecification gs = new GalaxySpecification.S0(500, 500, 250);

		long start1 = System.currentTimeMillis();
		List<int[]> coords1 = gs.nextCoordinats(amount);
		long duration1 = System.currentTimeMillis() - start1;

		logger.debug("coords1=" + coords1.size() + " time=" + duration1);

		long time = System.currentTimeMillis();
		if(paint)
		{
			logger.debug("----------------------");
			logger.debug("Generating Universe is done!");
			logger.debug("Painting...");
			paint(gs, coords1, time + "_01");
			logger.debug("Painting is done!");
		}

		if(js)
		{
			logger.debug("----------------------");
			try
			{
				logger.debug("writing coords...");
				createJS(coords1, time + "_01.js");
				logger.debug("  coords written");
			}
			catch(IOException e)
			{
				logger.error("Could not write coords to file: " + e.getMessage());
			}
		}
		logger.debug("----------------------");
	}

	private static void paint(GalaxySpecification gs, List<int[]> coords, String filename)
	{
		JFrame view = new GalaxyViewFrame(gs, coords);
		view.setTitle(view.getTitle() + " - " + filename);
		view.requestFocus();

		BufferedImage imageXY = GalaxyViewImages.createView(EnumGalaxyViewMode.xy, gs, coords);
		BufferedImage imageYZ = GalaxyViewImages.createView(EnumGalaxyViewMode.yz, gs, coords);
		BufferedImage imageXZ = GalaxyViewImages.createView(EnumGalaxyViewMode.xz, gs, coords);

		try
		{
			logger.debug("writing 3 images...");
			ImageIO.write(imageXY, "png", new File("image_" + filename + "_XY.png"));
			logger.debug("  image XY written");
			ImageIO.write(imageYZ, "png", new File("image_" + filename + "_YZ.png"));
			logger.debug("  image YZ written");
			ImageIO.write(imageXZ, "png", new File("image_" + filename + "_XZ.png"));
			logger.debug("  image XZ written");
		}
		catch(IOException e)
		{
			logger.error("Could not write image to file: " + e.getMessage());
		}
	}

	private static void createJS(List<int[]> coords, String filename) throws IOException
	{
		StringBuilder sb = new StringBuilder();
		sb.append("var sectors = [\n");
		for(int[] sec : coords)
		{
			sb.append("\t[" + sec[0] + "," + sec[1] + "," + sec[2] + "]");
			sb.append(",\n");
		}
		sb.deleteCharAt(sb.length() - 1);
		sb.deleteCharAt(sb.length() - 1);
		sb.append("\n];");
		OutputStream os = new BufferedOutputStream(new FileOutputStream(new File(filename)));
		os.write(sb.toString().getBytes());
		os.flush();
		os.close();
	}

}

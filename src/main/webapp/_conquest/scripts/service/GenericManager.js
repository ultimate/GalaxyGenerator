/**
 * Syncnapsis Framework - Copyright (c) 2012-2014 ultimate
 * 
 * This program is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either version
 * 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MECHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Plublic License along with this program;
 * if not, see <http://www.gnu.org/licenses/>.
 */

GenericManager = function()
{
	this.get = function(id)
	{
		// return entity
	};
	
	this.getAll = function()
	{
		// return all entities		
	};
	
	this.save = function(entity)
	{
		// returns updated entity
		// result callback must be passed as argument! no return here!		
	};
	
//	this.delete = function(entity)
//	{
//		// result callback must be passed as argument! no return here!		
//	};
};

GenericNameManager = function()
{
	this.getByName = function(name)
	{
		// return entity
	};
};

GenericNameManager.prototype = new GenericManager();

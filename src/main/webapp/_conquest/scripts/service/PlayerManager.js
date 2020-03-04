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
//@requires("GenericManager")
//@requires("Client")

PlayerManager = function()
{	
	this.login = function(username, password)
	{
		// return Player
		return function(player) { client.uiManager.onLogin(player); };
	};
	
	this.logout = function()
	{
		// return boolean
		return function(success) { client.uiManager.onLogout(success); };
	};
	
	this.register = function(username, email, password, passwordConfirm)
	{
		// return Player
		return function(player) { client.uiManager.onRegister(player); };
	};
	
	this.getCurrent = function()
	{
		// return Player
		return function(player) {
			if(player != null)
				client.uiManager.onLogin(player);
			else
				client.uiManager.onLogout(true);
		};
	};
};

PlayerManager.prototype = new GenericManager();